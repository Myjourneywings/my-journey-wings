
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';

import { supabase, isSupabaseConfigured } from './lib/supabase';

import {
  LayoutDashboard,
  FileCheck2,
  Sun,
  ClipboardCheck,
  Landmark,
  Users,
  BarChart3,
  Trophy,
  Settings,
  LogOut,
  Menu,
  Search,
  Bell,
  Plus,
  RefreshCw,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  CircleHelp,
  X,
  TrendingUp
} from 'lucide-react';

type ModuleKey =
  | 'loan_verification'
  | 'solar_verification'
  | 'pre_sanction_solar'
  | 'current_account_verification';

type CaseRow = {
  id: string;
  case_number: number;
  module: ModuleKey;
  status: string;
  customer_name: string;
  reference_number: string | null;
  created_at: string;
};

type Profile = {
  full_name: string | null;
  email: string | null;
  role: string;
};

const modules = [
  {
    key: 'loan_verification',
    label: 'Loan Verification',
    icon: FileCheck2
  },
  {
    key: 'solar_verification',
    label: 'Solar Verification',
    icon: Sun
  },
  {
    key: 'pre_sanction_solar',
    label: 'Pre-Sanction Solar',
    icon: ClipboardCheck
  },
  {
    key: 'current_account_verification',
    label: 'Current Account Verification',
    icon: Landmark
  }
] as const;

const pretty = (value: string) =>
  value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, character => character.toUpperCase());

/* MJW TRADING CORPORATE BRAND */

function Brand() {
  return (
    <div className="brand">
      <img
        src="/mjw-logo.png"
        alt="MJW Trading Management Company"
        style={{
          width: 180,
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}

/* LOGIN PAGE */

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (!isSupabaseConfigured) {
        setError('Supabase configuration is missing.');
        return;
      }

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (loginError) {
        setError(loginError.message);
      }
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-panel">
        <Brand />

        <div className="login-copy">
          <span className="eyebrow">
            MANAGEMENT PORTAL
          </span>

          <h1>Welcome back</h1>

          <p>
            Sign in to continue to your workspace.
          </p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={event =>
                setEmail(event.target.value)
              }
              placeholder="you@company.com"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={event =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            className="primary full"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="login-foot">
          <ShieldCheck size={15} />
          Secure access for authorised team members
        </div>
      </div>

      <div className="login-art">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />

        <div className="art-content">
          <div className="art-icon">
            <TrendingUp size={42} />
          </div>

          <span>BUSINESS MANAGEMENT</span>

          <h2>
            Manage Operations
            <br />
            with Confidence.
          </h2>

          <p>
            A secure workspace for managing your
            company's verification operations,
            data and performance.
          </p>
        </div>

        <div className="art-bottom">
          MJW TRADING · MANAGEMENT PORTAL
        </div>
      </div>
    </div>
  );
}

/* DASHBOARD STAT CARD */

function Stat({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: typeof FileCheck2;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

/* CASE TABLE */

function CaseTable({ rows }: { rows: CaseRow[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Customer</th>
            <th>Module</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map(item => (
              <tr key={item.id}>
                <td className="case-id">
                  #{item.case_number}
                </td>

                <td>
                  <b>{item.customer_name}</b>
                  <small>
                    {item.reference_number ||
                      'No reference'}
                  </small>
                </td>

                <td>{pretty(item.module)}</td>

                <td>
                  <span
                    className={`status ${item.status}`}
                  >
                    {pretty(item.status)}
                  </span>
                </td>

                <td>
                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="empty-row">
                No cases found yet.
                Cases will appear here when created.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AccountSecurity() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (password.length < 12) {
      setError('Use a password with at least 12 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSaving(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError('Your session has expired. Please request a new recovery email.');
        return;
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password
        });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setPassword('');
      setConfirmPassword('');
      setMessage('Password updated successfully. You can now sign in using your new password.');
    } catch {
      setError('Unable to update your password. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="module-summary">
      <div style={{ width: '100%', maxWidth: 520 }}>
        <h2>Account Security</h2>
        <p>Change your MJW Trading account password.</p>

        <form onSubmit={changePassword} className="login-form">
          <label>
            New password
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              minLength={12}
              required
            />
          </label>

          <label>
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              minLength={12}
              required
            />
          </label>

          {error && <div className="error">{error}</div>}
          {message && <p role="status">{message}</p>}

          <button className="primary" type="submit" disabled={saving}>
            {saving ? 'Updating password…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* MAIN APPLICATION */

function App() {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('Dashboard');

  const [cases, setCases] = useState<CaseRow[]>([]);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
const [referenceNumber, setReferenceNumber] = useState('');
const [caseSaving, setCaseSaving] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  async function saveNewCase(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!session?.user || profile?.role !== 'super_admin') {
    setNotice('Only Super Admins can create cases.');
    return;
  }

  if (!customerName.trim()) {
    setNotice('Please enter the customer name.');
    return;
  }

  setCaseSaving(true);
  setNotice('');

  try {
    const { data, error } = await supabase
      .from('verification_cases')
      .insert({
        
module: ({
  'Loan Verification': 'loan_verification',
  'Solar Verification': 'solar_verification',
  'Pre-Sanction Solar': 'pre_sanction_solar',
  'Current Account Verification': 'current_account_verification'
} as Record<string, string>)[page],

        customer_name: customerName.trim(),
        reference_number: referenceNumber.trim() || null,
        status: 'new',
        created_by: session.user.id
      })
      .select(
        'id,case_number,module,status,customer_name,reference_number,created_at'
      )
      .single();

    if (error) throw error;

    setCases((previous) => [data as CaseRow, ...previous].slice(0, 8));
    setCustomerName('');
    setReferenceNumber('');
    setNewCaseOpen(false);
    setNotice('New verification case created successfully.');
  } catch (error) {
    setNotice(
      error instanceof Error
        ? 'Unable to create case: ' + error.message
        : 'Unable to create case. Please try again.'
    );
  } finally {
    setCaseSaving(false);
  }
}

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setLoading(false);
      }
    }).catch(() => {
      if (active) setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!session?.user) {
        setCases([]);
        setProfile(null);
        return;
      }

      setBusy(true);

      const [profileResult, casesResult] =
        await Promise.all([
          supabase
            .from('profiles')
            .select('full_name,email,role')
            .eq('id', session.user.id)
            .maybeSingle(),

          supabase
            .from('verification_cases')
            .select(
              'id,case_number,module,status,customer_name,reference_number,created_at'
            )
            .order('created_at', {
              ascending: false
            })
            .limit(8)
        ]);

      if (cancelled) return;

      if (profileResult.data) {
        setProfile(profileResult.data as Profile);
      }

      if (casesResult.data) {
        setCases(casesResult.data as CaseRow[]);
      }

      if (casesResult.error) {
        setNotice(
          'Could not load cases: ' +
            casesResult.error.message
        );
      }

      setBusy(false);
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const counts = useMemo(() => ({
    total: cases.length,
    pending: cases.filter(item =>
      ['new', 'in_progress', 'pending'].includes(
        item.status
      )
    ).length,
    approved: cases.filter(
      item => item.status === 'approved'
    ).length,
    rejected: cases.filter(
      item => item.status === 'rejected'
    ).length
  }), [cases]);

  const nav = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Loan Verification', icon: FileCheck2 },
    { name: 'Solar Verification', icon: Sun },
    {
      name: 'Pre-Sanction Solar',
      icon: ClipboardCheck
    },
    {
      name: 'Current Account Verification',
      icon: Landmark
    },
    { name: 'Team & Users', icon: Users },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Leaderboard', icon: Trophy }
  ];

  const filtered = useMemo(() => {
    const selected = modules.find(
      module => module.label === page
    );

    return selected
      ? cases.filter(
          item => item.module === selected.key
        )
      : cases;
  }, [cases, page]);

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setNotice(error.message);
    }
  }

  async function refresh() {
    if (!session?.user) return;

    setBusy(true);

    const { data, error } = await supabase
      .from('verification_cases')
      .select(
        'id,case_number,module,status,customer_name,reference_number,created_at'
      )
      .order('created_at', {
        ascending: false
      })
      .limit(8);

    if (error) {
      setNotice(error.message);
    } else {
      setCases((data || []) as CaseRow[]);
    }

    setBusy(false);
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Preparing your workspace…
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Login />

        {!isSupabaseConfigured && (
          <div className="config-warning">
            Setup required: configure your Supabase
            environment variables.
          </div>
        )}
      </>
    );
  }

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          mobileOpen ? 'open' : ''
        }`}
      >
        <Brand />

        <div className="workspace-label">
          WORKSPACE
        </div>

        <nav>
          {nav.map(item => (
            <button
              key={item.name}
              className={`nav-item ${
                page === item.name ? 'active' : ''
              }`}
              onClick={() => {
                setPage(item.name);
                setMobileOpen(false);
              }}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <ShieldCheck size={19} />
            <b>Secure workspace</b>
            <span>
              Your operations, in one place.
            </span>
          </div>

          <button
            className="nav-item"
            onClick={() => setPage('Settings')}
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            className="nav-item"
            onClick={logout}
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            aria-label="Toggle menu"
          >
            <Menu />
          </button>

          <div className="crumb">
            Workspace <span>/</span> {page}
          </div>

          <div className="top-actions">
            <button
              className="icon-btn"
              onClick={refresh}
              disabled={busy}
              title="Refresh"
            >
              <RefreshCw size={17} />
            </button>

            <button
              className="icon-btn"
              title="Notifications"
              onClick={() =>
                setNotice(
                  'Notifications are not yet available.'
                )
              }
            >
              <Bell size={17} />
            </button>

            <div className="avatar">
              {(
                profile?.full_name ||
                session.user.email ||
                'M'
              ).slice(0, 1).toUpperCase()}
            </div>

            <div className="user-meta">
              <b>
                {profile?.full_name ||
                  'Team member'}
              </b>

              <span>
                {pretty(profile?.role || 'agent')}
              </span>
            </div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                MJW TRADING
              </span>

              <h1>
                {page === 'Dashboard'
                  ? 'Good to see you'
                  : page}
              </h1>

              <p>
                {page === 'Dashboard'
                  ? 'Here is an overview of your verification operations.'
                  : `Manage and review ${page.toLowerCase()} activity.`}
              </p>
            </div>

            {page !== 'Dashboard' &&
              page !== 'Settings' &&
              !['Team & Users', 'Reports', 'Leaderboard'].includes(page) && (
                <button
                  className="primary"
                  onClick={() => setNewCaseOpen(true)}
                >
                  <Plus size={17} />
                  New case
                </button>
              )}
          </div>
{newCaseOpen && (
  <div className="new-case-overlay">
    <div className="new-case-modal">
      <h2>Create New Verification Case</h2>
      <p>Enter the customer details below.</p>

      <form onSubmit={saveNewCase}>
        <label htmlFor="case-customer">Customer Name *</label>
        <input
          id="case-customer"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
          required
        />

        <label htmlFor="case-reference">Reference Number</label>
        <input
          id="case-reference"
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="Enter reference number"
        />

        <div className="new-case-actions">
          <button
            type="button"
            onClick={() => setNewCaseOpen(false)}
            disabled={caseSaving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary"
            disabled={caseSaving}
          >
            {caseSaving ? 'Saving...' : 'Save Case'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
          {notice && (
            <div className="notice">
              <span>{notice}</span>

              <button
                onClick={() => setNotice('')}
                aria-label="Dismiss notice"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {page === 'Dashboard' ? (
            <>
              <div className="stats-grid">
                <Stat
                  icon={FileCheck2}
                  label="Recent cases"
                  value={counts.total}
                  tone="blue"
                />

                <Stat
                  icon={Clock3}
                  label="Open / pending"
                  value={counts.pending}
                  tone="amber"
                />

                <Stat
                  icon={CheckCircle2}
                  label="Approved"
                  value={counts.approved}
                  tone="green"
                />

                <Stat
                  icon={XCircle}
                  label="Rejected"
                  value={counts.rejected}
                  tone="rose"
                />
              </div>

              <div className="section-title">
                <div>
                  <h2>Verification modules</h2>
                  <p>
                    Choose a module to review its cases.
                  </p>
                </div>
              </div>

              <div className="module-grid">
                {modules.map(module => (
                  <button
                    className="module-card"
                    key={module.key}
                    onClick={() =>
                      setPage(module.label)
                    }
                  >
                    <div className="module-icon">
                      <module.icon size={21} />
                    </div>

                    <div>
                      <b>{module.label}</b>
                      <span>
                        Open module{' '}
                        <span className="arrow">
                          ↗
                        </span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="section-title recent-title">
                <div>
                  <h2>Recent cases</h2>
                  <p>
                    Latest cases across verification
                    modules.
                  </p>
                </div>

                <button
                  className="text-btn"
                  onClick={() =>
                    setPage('Loan Verification')
                  }
                >
                  View modules
                </button>
              </div>

              <CaseTable rows={cases} />
            </>
          ) : page === 'Settings' ? (
  <AccountSecurity />
          ) : [
              'Team & Users',
              'Reports',
              'Leaderboard'
            ].includes(page) ? (
            <div className="empty-card">
              <CircleHelp size={28} />
              <h3>{page} setup is next</h3>
              <p>
                This section will be connected to
                your database in a future update.
              </p>
            </div>
          ) : (
            <>
              <div className="module-summary">
                <div>
                  <span className="eyebrow">
                    CASE MANAGEMENT
                  </span>

                  <h2>
                    {filtered.length} recent cases
                  </h2>
                </div>

                <div className="search-box">
                  <Search size={16} />

                  <input
                    placeholder="Search cases (coming soon)"
                    disabled
                  />
                </div>
              </div>

              <CaseTable rows={filtered} />
            </>
          )}
        </div>

        <footer>
          © {new Date().getFullYear()} MJW TRADING
          <span> · </span>
          Secure Management Portal
        </footer>
      </main>
    </div>
  );
}

export default App;
