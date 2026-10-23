import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { Loading, EmptyState, ErrorMessage, SuccessMessage } from '../components/UI';
import { getFIRs, updateFIRStatus } from '../services/firService';
import './AdminDashboard.css';

import {
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiUser,
  FiMapPin,
  FiTrendingUp,
  FiLayers,
  FiActivity,
  FiX,
  FiChevronRight,
  FiShield
} from 'react-icons/fi';

const STATUS_PIPELINE = [
  { name: 'Submitted', key: 'Submitted', color: '#d97706', bg: '#fef3c7' },
  { name: 'Under Review', key: 'Under Review', color: '#b45309', bg: '#fde68a' },
  { name: 'Assigned', key: 'Assigned', color: '#4338ca', bg: '#e0e7ff' },
  { name: 'Investigation', key: 'Investigation in Progress', color: '#7c3aed', bg: '#ede9fe' },
  { name: 'Resolved / Closed', key: 'Resolved', color: '#059669', bg: '#d1fae5' },
];

const ALL_STATUSES = [
  'Submitted',
  'Under Review',
  'Assigned',
  'Investigation in Progress',
  'Resolved',
  'Closed',
  'Rejected',
  'Withdrawn'
];

export default function AdminDashboard() {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics' | 'all'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [quickUpdateFIR, setQuickUpdateFIR] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', assignedOfficer: '', remarks: '' });
  const [updating, setUpdating] = useState(false);

  const fetchComplaints = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError('');
    try {
      const response = await getFIRs();
      setFirs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load complaints. Please refresh.');
    } finally {
      setLoading(false);
      if (isRefresh) setTimeout(() => setRefreshing(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Computed metrics
  const stats = useMemo(() => {
    const total = firs.length;
    const submitted = firs.filter(f => f.status === 'Submitted').length;
    const underReview = firs.filter(f => f.status === 'Under Review').length;
    const pendingTotal = submitted + underReview;
    const inInvestigation = firs.filter(
      f => f.status === 'Assigned' || f.status === 'Investigation in Progress'
    ).length;
    const resolvedOrClosed = firs.filter(f => f.status === 'Resolved' || f.status === 'Closed').length;
    const unassigned = firs.filter(f => !f.assignedOfficer || f.assignedOfficer.trim() === '').length;
    const resolutionRate = total > 0 ? Math.round((resolvedOrClosed / total) * 100) : 0;

    // Categories breakdown
    const categoryCounts = {};
    firs.forEach(f => {
      const cat = f.complaintType || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const categoriesSorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

    // City distribution
    const cityCounts = {};
    firs.forEach(f => {
      const city = f.incidentCity || 'Unspecified';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    const citiesSorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

    // Officer assignment workload
    const officerMap = {};
    firs.forEach(f => {
      const officer = f.assignedOfficer?.trim() || 'Unassigned';
      officerMap[officer] = (officerMap[officer] || 0) + 1;
    });
    const officersSorted = Object.entries(officerMap).sort((a, b) => b[1] - a[1]);

    // Urgent complaints (Submitted or Unassigned)
    const urgentItems = firs.filter(
      f => f.status === 'Submitted' || (!f.assignedOfficer && f.status !== 'Resolved' && f.status !== 'Closed')
    );

    return {
      total,
      submitted,
      underReview,
      pendingTotal,
      inInvestigation,
      resolvedOrClosed,
      unassigned,
      resolutionRate,
      categoriesSorted,
      citiesSorted,
      officersSorted,
      urgentItems
    };
  }, [firs]);

  // Filtered FIRs for table
  const filteredFIRs = useMemo(() => {
    return firs.filter(f => {
      const matchesSearch =
        !search ||
        f.referenceNumber?.toLowerCase().includes(search.toLowerCase()) ||
        f.complainantName?.toLowerCase().includes(search.toLowerCase()) ||
        f.complaintType?.toLowerCase().includes(search.toLowerCase()) ||
        f.incidentCity?.toLowerCase().includes(search.toLowerCase()) ||
        f.title?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Resolved'
          ? f.status === 'Resolved' || f.status === 'Closed'
          : f.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [firs, search, statusFilter]);

  // Quick update modal open
  const openQuickUpdate = fir => {
    setQuickUpdateFIR(fir);
    setUpdateForm({
      status: fir.status,
      assignedOfficer: fir.assignedOfficer || '',
      remarks: ''
    });
    setError('');
  };

  const handleQuickSubmit = async e => {
    e.preventDefault();
    if (!updateForm.remarks.trim()) {
      setError('Please provide an administrative note explaining this update.');
      return;
    }
    setUpdating(true);
    setError('');
    try {
      const { data } = await updateFIRStatus(quickUpdateFIR.id, updateForm);
      setFirs(prev => prev.map(item => (item.id === quickUpdateFIR.id ? data : item)));
      if (selectedFIR?.id === quickUpdateFIR.id) setSelectedFIR(data);
      setSuccess(`Updated complaint ${data.referenceNumber} to "${data.status}".`);
      setQuickUpdateFIR(null);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update complaint status.');
    } finally {
      setUpdating(false);
    }
  };

  // CSV Export
  const exportCSV = () => {
    if (firs.length === 0) return;
    const headers = [
      'Reference Number',
      'Complainant Name',
      'Mobile',
      'Email',
      'Complaint Type',
      'Title',
      'Incident Date',
      'City',
      'State',
      'Status',
      'Assigned Officer',
      'Submitted Date'
    ];

    const rows = firs.map(f => [
      `"${f.referenceNumber || ''}"`,
      `"${(f.complainantName || '').replace(/"/g, '""')}"`,
      `"${f.complainantMobile || ''}"`,
      `"${f.complainantEmail || ''}"`,
      `"${f.complaintType || ''}"`,
      `"${(f.title || '').replace(/"/g, '""')}"`,
      `"${f.incidentDate || ''}"`,
      `"${f.incidentCity || ''}"`,
      `"${f.incidentState || ''}"`,
      `"${f.status || ''}"`,
      `"${(f.assignedOfficer || '').replace(/"/g, '""')}"`,
      `"${f.submittedDate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicDesk_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        {/* Header command bar */}
        <div className="admin-header-strip">
          <div className="admin-title-area">
            <h1>
              Civic Command Center
              <span className="live-pill">
                <span className="pulse-dot"></span> Live Portal
              </span>
            </h1>
            <p>Comprehensive incident management, status tracking, and dispatch analytics</p>
          </div>

          <div className="admin-actions">
            <button
              className="admin-btn admin-btn-outline"
              onClick={() => fetchComplaints(true)}
              disabled={refreshing}
              title="Refresh complaint database"
            >
              <FiRefreshCw className={refreshing ? 'spin-icon' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Sync Data'}</span>
            </button>

            <button
              className="admin-btn admin-btn-outline"
              onClick={exportCSV}
              disabled={firs.length === 0}
              title="Download CSV report"
            >
              <FiDownload />
              <span>Export CSV</span>
            </button>

            <Link to="/admin/firs" className="admin-btn admin-btn-primary">
              <FiLayers />
              <span>Detailed Case Registry</span>
            </Link>
          </div>
        </div>

        {/* Global messages */}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {/* Navigation tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiActivity /> Overview & Actions
          </button>
          <button
            className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FiTrendingUp /> Pipeline & Analytics
          </button>
          <button
            className={`admin-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FiFileText /> Complaints Registry ({firs.length})
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="admin-stats-grid">
          {/* Card 1: Total */}
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div>
                <div className="admin-stat-val">{stats.total}</div>
                <div className="admin-stat-title">Total FIRs Logged</div>
              </div>
              <div className="admin-stat-icon-wrap" style={{ background: '#e8eff9', color: '#092D67' }}>
                <FiFileText />
              </div>
            </div>
            <div className="admin-stat-footer">
              <span>All recorded complaints</span>
              <span className="admin-stat-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                100% Captured
              </span>
            </div>
          </div>

          {/* Card 2: Awaiting Review */}
          <div
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('all');
              setStatusFilter('Submitted');
            }}
          >
            <div className="admin-stat-top">
              <div>
                <div className="admin-stat-val" style={{ color: '#d97706' }}>
                  {stats.pendingTotal}
                </div>
                <div className="admin-stat-title">Awaiting Review</div>
              </div>
              <div className="admin-stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                <FiClock />
              </div>
            </div>
            <div className="admin-stat-footer">
              <span>{stats.submitted} new • {stats.underReview} in review</span>
              <span className="admin-stat-badge" style={{ background: '#fef3c7', color: '#b45309' }}>
                High Priority
              </span>
            </div>
          </div>

          {/* Card 3: Active Investigations */}
          <div
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('all');
              setStatusFilter('Investigation in Progress');
            }}
          >
            <div className="admin-stat-top">
              <div>
                <div className="admin-stat-val" style={{ color: '#7c3aed' }}>
                  {stats.inInvestigation}
                </div>
                <div className="admin-stat-title">Active Investigations</div>
              </div>
              <div className="admin-stat-icon-wrap" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <FiShield />
              </div>
            </div>
            <div className="admin-stat-footer">
              <span>Dispatched to field officers</span>
              <span className="admin-stat-badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                In Progress
              </span>
            </div>
          </div>

          {/* Card 4: Resolution Rate */}
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div>
                <div className="admin-stat-val" style={{ color: '#059669' }}>
                  {stats.resolutionRate}%
                </div>
                <div className="admin-stat-title">Resolution Efficiency</div>
              </div>
              <div className="admin-stat-icon-wrap" style={{ background: '#d1fae5', color: '#059669' }}>
                <FiCheckCircle />
              </div>
            </div>
            <div className="resolution-gauge">
              <div className="resolution-gauge-fill" style={{ width: `${stats.resolutionRate}%` }}></div>
            </div>
            <div className="admin-stat-footer" style={{ marginTop: 8 }}>
              <span>{stats.resolvedOrClosed} closed or resolved cases</span>
              <span className="admin-stat-badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                Satisfactory
              </span>
            </div>
          </div>
        </div>

        {/* Urgent Attention Alert Banner */}
        {stats.urgentItems.length > 0 && (
          <div className="urgent-attention-card">
            <div className="urgent-info">
              <div className="urgent-icon">
                <FiAlertCircle />
              </div>
              <div>
                <h3>Immediate Attention Required: {stats.urgentItems.length} Case(s) Pending Immediate Action</h3>
                <p>
                  Unassigned or freshly submitted complaints await supervisory review and officer dispatch.
                </p>
              </div>
            </div>
            <button
              className="admin-btn admin-btn-outline"
              style={{ background: 'white', borderColor: '#f59e0b', color: '#92400e' }}
              onClick={() => {
                setActiveTab('all');
                setStatusFilter('Submitted');
              }}
            >
              Filter Pending Cases →
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Interactive Pipeline Funnel */}
            <div className="pipeline-card">
              <div className="pipeline-header">
                <h2>Complaint Life-Cycle Pipeline</h2>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>Click any stage to filter records</span>
              </div>
              <div className="pipeline-steps">
                {STATUS_PIPELINE.map(step => {
                  const count =
                    step.key === 'Resolved'
                      ? firs.filter(f => f.status === 'Resolved' || f.status === 'Closed').length
                      : firs.filter(f => f.status === step.key).length;
                  const isCurrent = statusFilter === step.key;

                  return (
                    <div
                      key={step.name}
                      className={`pipeline-step ${isCurrent ? 'active' : ''}`}
                      onClick={() => {
                        setStatusFilter(isCurrent ? 'All' : step.key);
                      }}
                    >
                      <div className="pipeline-step-top">
                        <span className="pipeline-step-count" style={{ color: step.color }}>
                          {count}
                        </span>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: step.color
                          }}
                        />
                      </div>
                      <div className="pipeline-step-name">{step.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Overview Split: Breakdown + Active Officers */}
            <div className="admin-analytics-grid">
              {/* Category Breakdown */}
              <div className="analytics-card">
                <div className="analytics-card-header">
                  <h2>Category Distribution</h2>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Top complaint types</span>
                </div>
                {stats.categoriesSorted.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: 13 }}>No complaints recorded yet.</p>
                ) : (
                  <div className="category-bars">
                    {stats.categoriesSorted.slice(0, 5).map(([cat, count]) => {
                      const pct = Math.round((count / (stats.total || 1)) * 100);
                      const colors = ['#092D67', '#2563eb', '#7c3aed', '#d97706', '#059669'];
                      const colorIndex = Math.abs(cat.charCodeAt(0) % colors.length);
                      return (
                        <div key={cat} className="cat-bar-item">
                          <div className="cat-bar-label">
                            <span>{cat}</span>
                            <span>
                              {count} case(s) ({pct}%)
                            </span>
                          </div>
                          <div className="cat-bar-track">
                            <div
                              className="cat-bar-fill"
                              style={{ width: `${pct}%`, background: colors[colorIndex] }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Officer Workload & Locations */}
              <div className="analytics-card">
                <div className="analytics-card-header">
                  <h2>Assigned Officers Workload</h2>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Case distribution</span>
                </div>
                <div className="officers-list">
                  {stats.officersSorted.slice(0, 4).map(([officer, count]) => (
                    <div key={officer} className="officer-row">
                      <div className="officer-info">
                        <div className="officer-avatar">
                          {officer.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="officer-name">{officer}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {officer === 'Unassigned' ? 'Requires dispatch' : 'Investigating Officer'}
                          </div>
                        </div>
                      </div>
                      <span
                        className="officer-badge"
                        style={
                          officer === 'Unassigned'
                            ? { background: '#fee2e2', color: '#b91c1c' }
                            : { background: '#e0e7ff', color: '#3730a3' }
                        }
                      >
                        {count} Case(s)
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Geographic Hotspots
                  </div>
                  <div className="hotspots-tags">
                    {stats.citiesSorted.slice(0, 5).map(([city, count]) => (
                      <span key={city} className="hotspot-chip">
                        <FiMapPin style={{ color: '#092D67' }} />
                        {city} <b>{count}</b>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: DETAILED ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="admin-analytics-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="analytics-card">
              <div className="analytics-card-header">
                <h2>All Complaint Categories</h2>
                <span style={{ fontSize: 12, color: '#64748b' }}>Total count breakdown</span>
              </div>
              <div className="category-bars">
                {stats.categoriesSorted.map(([cat, count]) => {
                  const pct = Math.round((count / (stats.total || 1)) * 100);
                  return (
                    <div key={cat} className="cat-bar-item">
                      <div className="cat-bar-label">
                        <span style={{ fontWeight: 600 }}>{cat}</span>
                        <span>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="cat-bar-track">
                        <div className="cat-bar-fill" style={{ width: `${pct}%`, background: '#092D67' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-header">
                <h2>Jurisdiction & City Distribution</h2>
                <span style={{ fontSize: 12, color: '#64748b' }}>Reported incidents by location</span>
              </div>
              <div className="category-bars">
                {stats.citiesSorted.map(([city, count]) => {
                  const pct = Math.round((count / (stats.total || 1)) * 100);
                  return (
                    <div key={city} className="cat-bar-item">
                      <div className="cat-bar-label">
                        <span>{city}</span>
                        <span>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="cat-bar-track">
                        <div className="cat-bar-fill" style={{ width: `${pct}%`, background: '#2563eb' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* COMPLAINTS TABLE CARD (Accessible in all tabs, focused in 'all') */}
        <div className="card" style={{ marginTop: activeTab === 'all' ? 0 : 20 }}>
          <div className="table-filter-bar">
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>
                {activeTab === 'overview' ? 'Recent Complaint Activity' : 'All Complaints Registry'}
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
                Showing {filteredFIRs.length} matching incident record(s)
              </p>
            </div>

            <div className="search-input-wrap">
              <FiSearch className="search-icon-inside" />
              <input
                className="form-control"
                placeholder="Search reference, complainant, city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Quick status filter pills */}
          <div className="filter-chips" style={{ marginBottom: 16 }}>
            {['All', 'Submitted', 'Under Review', 'Assigned', 'Investigation in Progress', 'Resolved'].map(
              status => (
                <button
                  key={status}
                  className={`filter-pill ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {loading ? (
            <Loading />
          ) : filteredFIRs.length === 0 ? (
            <EmptyState message="No complaint records found matching your filters." />
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>FIR Reference</th>
                    <th>Complainant</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Assigned Officer</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'overview' ? filteredFIRs.slice(0, 10) : filteredFIRs).map(fir => (
                    <tr key={fir.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#092D67', display: 'block' }}>
                          {fir.referenceNumber}
                        </span>
                        <small style={{ color: '#64748b', fontSize: 11 }}>
                          {fir.submittedDate?.slice(0, 10)}
                        </small>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{fir.complainantName}</div>
                        <small style={{ color: '#64748b', fontSize: 11 }}>{fir.complainantMobile}</small>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{fir.complaintType}</span>
                        {fir.title && (
                          <small
                            style={{
                              display: 'block',
                              color: '#64748b',
                              fontSize: 11,
                              maxWidth: 160,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {fir.title}
                          </small>
                        )}
                      </td>
                      <td>
                        <span>{fir.incidentCity || '—'}</span>
                        <small style={{ display: 'block', color: '#64748b', fontSize: 11 }}>
                          {fir.incidentState || ''}
                        </small>
                      </td>
                      <td>
                        {fir.assignedOfficer ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 12.5,
                              color: '#1e293b',
                              fontWeight: 600
                            }}
                          >
                            <FiUser style={{ color: '#092D67' }} />
                            {fir.assignedOfficer}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 11.5,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: '#fee2e2',
                              color: '#b91c1c',
                              fontWeight: 700
                            }}
                          >
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={fir.status} />
                      </td>
                      <td>
                        <div className="table-action-cell">
                          <button
                            className="btn-icon-action secondary"
                            onClick={() => setSelectedFIR(fir)}
                            title="Quick Inspect"
                          >
                            <FiEye /> Inspect
                          </button>
                          <button
                            className="btn-icon-action primary"
                            onClick={() => openQuickUpdate(fir)}
                            title="Quick Update Status"
                          >
                            <FiEdit /> Update
                          </button>
                          <Link
                            to={`/admin/fir/${fir.id}/review`}
                            className="btn-icon-action secondary"
                            title="Full Case Review"
                          >
                            <FiChevronRight />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QUICK INSPECT MODAL */}
        {selectedFIR && (
          <div className="modal-overlay" onClick={() => setSelectedFIR(null)}>
            <div className="modal quick-view-dialog" onClick={e => e.stopPropagation()}>
              <div className="quick-detail-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>
                    Complaint Details: {selectedFIR.referenceNumber}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                    <StatusBadge status={selectedFIR.status} />
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      Logged on {selectedFIR.submittedDate}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFIR(null)}
                  style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' }}
                >
                  <FiX />
                </button>
              </div>

              <div className="quick-detail-grid">
                <div className="quick-field">
                  <div className="quick-field-label">Complainant</div>
                  <div className="quick-field-val">{selectedFIR.complainantName}</div>
                  <small style={{ color: '#64748b' }}>{selectedFIR.complainantMobile}</small>
                </div>
                <div className="quick-field">
                  <div className="quick-field-label">Category / Incident</div>
                  <div className="quick-field-val">{selectedFIR.complaintType}</div>
                  <small style={{ color: '#64748b' }}>Date: {selectedFIR.incidentDate}</small>
                </div>
                <div className="quick-field">
                  <div className="quick-field-label">Location</div>
                  <div className="quick-field-val">
                    {selectedFIR.incidentLocation || selectedFIR.incidentCity}
                  </div>
                  <small style={{ color: '#64748b' }}>
                    {selectedFIR.incidentCity}, {selectedFIR.incidentState}
                  </small>
                </div>
                <div className="quick-field">
                  <div className="quick-field-label">Assigned Officer</div>
                  <div className="quick-field-val">
                    {selectedFIR.assignedOfficer || 'Not assigned yet'}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 6, fontWeight: 700, fontSize: 13, color: '#334155' }}>
                Incident Narrative / Description
              </div>
              <div className="quick-desc-box">{selectedFIR.description}</div>

              {selectedFIR.history?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 13, color: '#334155' }}>
                    Timeline & Administrative History
                  </div>
                  <ol className="complaint-history">
                    {selectedFIR.history.map((ev, idx) => (
                      <li key={idx}>
                        <strong>{ev.status}</strong>
                        <time>{new Date(ev.at).toLocaleString()}</time>
                        {ev.note && <p>{ev.note}</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: 20 }}>
                <button className="btn btn-secondary" onClick={() => setSelectedFIR(null)}>
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const f = selectedFIR;
                    setSelectedFIR(null);
                    openQuickUpdate(f);
                  }}
                >
                  <FiEdit /> Update Status / Dispatch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUICK STATUS UPDATE MODAL */}
        {quickUpdateFIR && (
          <div className="modal-overlay" onClick={() => !updating && setQuickUpdateFIR(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>
                  Update Complaint Status
                </h3>
                <button
                  onClick={() => !updating && setQuickUpdateFIR(null)}
                  style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' }}
                >
                  <FiX />
                </button>
              </div>

              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                Updating record <strong style={{ color: '#092D67' }}>{quickUpdateFIR.referenceNumber}</strong> ({quickUpdateFIR.complainantName})
              </p>

              <form onSubmit={handleQuickSubmit}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={updateForm.status}
                    onChange={e => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign / Update Investigating Officer</label>
                  <input
                    className="form-control"
                    placeholder="e.g., Inspector Atul Yadav"
                    value={updateForm.assignedOfficer}
                    onChange={e => setUpdateForm(prev => ({ ...prev, assignedOfficer: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Administrative Action Note *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Provide detailed explanation of action taken or case update..."
                    value={updateForm.remarks}
                    onChange={e => setUpdateForm(prev => ({ ...prev, remarks: e.target.value }))}
                    required
                  />
                  <small style={{ color: '#64748b', fontSize: 11, marginTop: 4, display: 'block' }}>
                    Note will be permanently appended to the complaint audit trail.
                  </small>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setQuickUpdateFIR(null)}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updating || !updateForm.remarks.trim()}
                  >
                    {updating ? 'Saving Changes...' : 'Save & Append to Audit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
