// Rebuild Case Details popup
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';

import { supabase, isSupabaseConfigured } from './lib/supabase';
import { jsPDF } from 'jspdf';
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

type CaseActivityRow = {
  id: string;
  action: string;
  old_values: Record<string, string | null> | null;
  new_values: Record<string, string | null> | null;
  changed_by: string | null;
  created_at: string;
};

type CaseRow = {
  id: string;
  case_number: number;
  module: ModuleKey;
  status: string;
  customer_name: string;
  reference_number: string | null;
  created_at: string;
  
assigned_to: string | null;

};

type CaseDocumentRow = {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
  deletion_status: 'active' | 'deleting' | 'delete_failed';
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


function CaseTable({
  rows,
  onSelectCase
}: {
  rows: CaseRow[];
  onSelectCase: (selectedCase: CaseRow) => void;
}) {

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
  <button
    type="button"
    onClick={() => onSelectCase(item)}
    style={{
      background: 'none',
      border: 'none',
      color: '#1763a6',
      cursor: 'pointer',
      fontWeight: 700,
      padding: 0
    }}
  >
    #{item.case_number}
  </button>
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


function CaseDetails({
  selectedCase,
  onClose,
  onSaved,
    canEdit,
  canAssign,
  canUploadDocuments,
}: {
  selectedCase: CaseRow;
  onClose: () => void;
  onSaved: (updatedCase: CaseRow) => void;
  canEdit: boolean;
  canAssign: boolean;
  canUploadDocuments: boolean;
}) {
  const [editing, setEditing] = useState(false);
  
const [surveyOpen, setSurveyOpen] = useState(false);

  const [customerName, setCustomerName] =
    useState(selectedCase.customer_name);
  const [referenceNumber, setReferenceNumber] =
    useState(selectedCase.reference_number || '');
  const [status, setStatus] =
    useState(selectedCase.status);
  
const [assignedTo, setAssignedTo] = useState<string>(
  selectedCase.assigned_to || ''
);
const [agents, setAgents] = useState<
  { id: string; full_name: string | null; email: string | null }[]
>([]);
  useEffect(() => {
  if (!canEdit) return;

  let cancelled = false;

  async function loadAgents() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id,full_name,email')
      .eq('role', 'agent')
      .order('full_name', { ascending: true });

    if (cancelled) return;

    if (error) {
      console.error('Unable to load agents:', error);
      return;
    }

    setAgents(data || []);
  }

  void loadAgents();

  return () => {
    cancelled = true;
  };
}, [canEdit]);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

const [activities, setActivities] =
  useState<CaseActivityRow[]>([]);

const [activityLoading, setActivityLoading] =
  useState(true);

const [activityError, setActivityError] =
  useState('');

const [employeeNames, setEmployeeNames] =
  useState<Record<string, string>>({});


const [documents, setDocuments] =
  useState<CaseDocumentRow[]>([]);


const [documentsLoading, setDocumentsLoading] =
  useState(true);

const [documentUploading, setDocumentUploading] =
  useState(false);

const [documentError, setDocumentError] =
  useState('');

const [documentNotice, setDocumentNotice] =
  useState('');

const [deletingDocumentId, setDeletingDocumentId] =
  useState<string | null>(null);

const [documentUploaderNames, setDocumentUploaderNames] =
  useState<Record<string, string>>({});


useEffect(() => {
  let cancelled = false;

  async function loadActivity() {
    setActivityLoading(true);
    setActivityError('');
    setEmployeeNames({});

    const { data, error } = await supabase
      .from('case_activity')
      .select(
        'id,action,old_values,new_values,changed_by,created_at'
      )
      .eq('case_id', selectedCase.id)
      .order('created_at', { ascending: false });

    if (cancelled) return;

    if (error) {
      setActivityError(error.message);
      setActivities([]);
      setActivityLoading(false);
      return;
    }

    const activityRows =
      (data || []) as CaseActivityRow[];

    setActivities(activityRows);

    const userIds = [
      ...new Set(
        activityRows
          .map(item => item.changed_by)
          .filter((id): id is string => Boolean(id))
      )
    ];

    if (userIds.length > 0) {
      const { data: profiles, error: profileError } =
        await supabase
          .from('profiles')
          .select('id,full_name')
          .in('id', userIds);

      if (cancelled) return;

      if (profileError) {
        console.error(
          'Unable to load employee names:',
          profileError
        );
      } else {
        const names: Record<string, string> = {};

        for (const profile of profiles || []) {
          if (profile.id && profile.full_name) {
            names[profile.id] = profile.full_name;
          }
        }

        setEmployeeNames(names);
      }
    }

    if (!cancelled) {
      setActivityLoading(false);
    }
  }

  void loadActivity();

  return () => {
    cancelled = true;
  };
}, [selectedCase.id, selectedCase.status]);


useEffect(() => {
  let cancelled = false;

  async function loadDocuments() {
    setDocumentsLoading(true);
    setDocumentError('');

    const { data, error } = await supabase
      .from('case_documents')
      
.select(
  'id,file_name,file_path,file_type,file_size,uploaded_by,created_at,deletion_status'
)

      .eq('case_id', selectedCase.id)
      .order('created_at', { ascending: false });

    if (cancelled) return;

    if (error) {
      setDocumentError(error.message);
      setDocuments([]);
    } else {
      setDocuments(data || []);
      

const names: Record<string, string> = {};

const uniqueDocuments = (data || []).filter(
  (doc) => Boolean(doc.id && doc.uploaded_by)
);

const results = await Promise.all(
  uniqueDocuments.map(async (doc) => {
    const { data: uploaderName, error: nameError } =
      await supabase.rpc('get_case_document_uploader_name', {
        p_document_id: doc.id
      });

    return {
      uploadedBy: doc.uploaded_by,
      uploaderName,
      nameError
    };
  })
);

if (cancelled) return;

for (const result of results) {
  if (result.nameError) {
    console.error(
      'Unable to load document uploader name:',
      result.nameError
    );
  } else if (result.uploadedBy && result.uploaderName) {
    names[result.uploadedBy] = result.uploaderName;
  }
}

setDocumentUploaderNames(names);


    }

    setDocumentsLoading(false);
  }

  void loadDocuments();

  return () => {
    cancelled = true;
  };
}, [selectedCase.id]);

async function deleteDocument(
  doc: {
    id: string;
    file_name: string;
    file_path: string;
    
deletion_status: 'active' | 'deleting' | 'delete_failed';

  }
) {
  if (!canEdit) {
    setDocumentError('You do not have permission to delete documents.');
    return;
  }

 
const confirmed = window.confirm(
  `Are you sure you want to ${
    doc.deletion_status === 'delete_failed'
      ? 'retry deleting'
      : 'delete'
  } "${doc.file_name}"?`
);


  
if (!confirmed) return;

if (deletingDocumentId !== null) return;


setDeletingDocumentId(doc.id);
setDocumentError('');
setDocumentNotice('');

let deletionStartedByThisRequest = false;

try {

  const { data: deletionStarted, error: beginError } =
    await supabase.rpc('begin_case_document_deletion', {
      p_document_id: doc.id,
      p_case_id: selectedCase.id
    });

  if (beginError) throw beginError;

  if (deletionStarted !== true) {
    throw new Error(
      'Unable to start deletion. The document may already be processing.'
    );
  }

deletionStartedByThisRequest = true;

  const { error: storageError } = await supabase.storage
    .from('case-documents')
    .remove([doc.file_path]);


    if (storageError) throw storageError;

   
const { data: deletionFinished, error: finishError } =
  await supabase.rpc('finish_case_document_deletion', {
    p_document_id: doc.id,
    p_case_id: selectedCase.id
  });

if (finishError) throw finishError;

if (deletionFinished !== true) {
  throw new Error(
    'The file removal completed, but the database record could not be removed.'
  );
}


    setDocuments(previous =>
      previous.filter(item => item.id !== doc.id)
    );

    setDocumentNotice('Document deleted successfully.');
 
  
} catch (error) {
  const originalMessage =
    error instanceof Error
      ? error.message
      : 'Unable to delete document.';

  
if (deletionStartedByThisRequest) {
  try {

    const { error: failureError } = await supabase.rpc(
      'fail_case_document_deletion',
      {
        p_document_id: doc.id,
        p_case_id: selectedCase.id
      }
    );

    if (failureError) {
      console.error(
        'Unable to record document deletion failure:',
        failureError
      );
    }
  } catch (trackingError) {
    console.error(
      'Deletion failure tracking error:',
      trackingError
    );
  }
}

  setDocumentError(
    `${originalMessage} Please check the document before retrying.`
  );
} finally {
  setDeletingDocumentId(null);
}

}


async function viewDocument(
  filePath: string
) {
  setDocumentError('');
  setDocumentNotice('');

  try {
    const { data, error } = await supabase.storage
      .from('case-documents')
      .createSignedUrl(filePath, 60);

    if (error) throw error;

    if (!data?.signedUrl) {
      throw new Error('Unable to create document link.');
    }

    window.open(
      data.signedUrl,
      '_blank',
      'noopener,noreferrer'
    );
  } catch (error) {
    setDocumentError(
      error instanceof Error
        ? error.message
        : 'Unable to open document.'
    );
  }
}

async function uploadDocument(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  event.target.value = '';

  if (!canUploadDocuments) {
    setDocumentError('You do not have permission to upload documents.');
    return;
  }

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png'
  ];

  if (!allowedTypes.includes(file.type)) {
    setDocumentError('Only PDF, JPG and PNG files are allowed.');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    setDocumentError('Maximum file size is 10 MB.');
    return;
  }

  setDocumentUploading(true);
  setDocumentError('');
  setDocumentNotice('');

  let uploadedPath = '';

  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('Please sign in again.');

    const safeName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      '_'
    );

    const filePath =
      `${selectedCase.id}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('case-documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    uploadedPath = filePath;

    const { data, error: insertError } = await supabase
      .from('case_documents')
      .insert({
        case_id: selectedCase.id,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user.id
      })
      
.select(
  'id,file_name,file_path,file_type,file_size,uploaded_by,created_at,deletion_status'
)
.single();


    if (insertError) throw insertError;

    setDocuments(previous => [data, ...previous]);
    

const { data: uploaderProfile } = await supabase
  .from('profiles')
  .select('full_name')
  .eq('id', user.id)
  .maybeSingle();

setDocumentUploaderNames(previous => ({
  ...previous,
  [user.id]: uploaderProfile?.full_name || 'Unknown Employee'
}));

    setDocumentNotice('Document uploaded successfully.');
  } catch (error) {
    if (uploadedPath) {
      const { error: cleanupError } = await supabase.storage
        .from('case-documents')
        .remove([uploadedPath]);

      if (cleanupError) {
        console.error('Upload cleanup failed:', cleanupError);
      }
    }

    setDocumentError(
      error instanceof Error
        ? error.message
        : 'Unable to upload document.'
    );
  } finally {
    setDocumentUploading(false);
  }
}

  async function saveChanges() {
    if (!customerName.trim()) {
      setErrorMessage('Customer name is required.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('verification_cases')
        .update({
  customer_name: customerName.trim(),
  reference_number: referenceNumber.trim() || null,
  status,
  assigned_to: assignedTo || null
})
        .eq('id', selectedCase.id)
        .select(
          'id,case_number,module,status,customer_name,reference_number,created_at,assigned_to'
        )
        .single();

      if (error) throw error;

      onSaved(data as CaseRow);
      setEditing(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to save changes.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="presentation"
      onClick={() => {
        if (!saving) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Case Details"
        onClick={event => event.stopPropagation()}
        style={{
          background: '#fff',
          padding: 30,
          borderRadius: 16,
          width: '100%',
          maxWidth: 550,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        
<h2>
  {surveyOpen ? 'Loan Verification Site Survey' : 'Case Details'}
</h2>

{surveyOpen && (
  <button
    type="button"
    onClick={() => setSurveyOpen(false)}
    style={{ marginBottom: 16 }}
  >
    ← Back to Case Details
  </button>
)}

{surveyOpen && (
  
<LoanVerificationSurvey
  selectedCase={selectedCase}
  canReview={canEdit && canAssign}
/>

)}

{!surveyOpen && (
  <>
        <p>
          <strong>Case ID:</strong>
          {' '}#{selectedCase.case_number}
        </p>

        {editing ? (
          <>
            <p>
              <strong>Customer Name</strong>
              <input
                value={customerName}
                onChange={event =>
                  setCustomerName(event.target.value)
                }
                style={{ width: '100%', padding: 10 }}
              />
            </p>

            <p>
              <strong>Reference Number</strong>
              <input
                value={referenceNumber}
                onChange={event =>
                  setReferenceNumber(event.target.value)
                }
                style={{ width: '100%', padding: 10 }}
              />
            </p>

            <p>
              <strong>Status</strong>
              <select
                value={status}
                onChange={event =>
                  setStatus(event.target.value)
                }
                style={{ width: '100%', padding: 10 }}
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </p>
            {canAssign && (
            <p>
  <strong>Assign to Agent:</strong>
  <select
    value={assignedTo}
    onChange={(event) => setAssignedTo(event.target.value)}
    style={{
      width: '100%',
      padding: 10,
      marginTop: 8
    }}
  >
    <option value="">Unassigned</option>
    {agents.map((agent) => (
      <option key={agent.id} value={agent.id}>
        {agent.full_name || agent.email || agent.id}
      </option>
    ))}
  </select>
</p>
            )}
          </>
        ) : (
          <>
            <p>
              <strong>Customer:</strong>
              {' '}{selectedCase.customer_name}
            </p>
            <p>
              <strong>Reference:</strong>
              {' '}{selectedCase.reference_number || 'N/A'}
            </p>
            <p>
              <strong>Status:</strong>
              {' '}{pretty(selectedCase.status)}
            </p>
          </>
        )}

        <p>
          <strong>Module:</strong>
          {' '}{pretty(selectedCase.module)}
        </p>

        <p>
          <strong>Created:</strong>
          {' '}
          {new Date(
            selectedCase.created_at
          ).toLocaleDateString()}
        </p>

<section className="case-documents-section">
  <h3>Case Documents</h3>

  {canUploadDocuments && (
    <div style={{ marginBottom: '16px' }}>
      <label
        style={{
          display: 'inline-block',
          padding: '10px 16px',
          background: '#1d5f9f',
          color: '#fff',
          borderRadius: '8px',
          cursor: documentUploading ? 'wait' : 'pointer'
        }}
      >
        {documentUploading
          ? 'Uploading...'
          : '+ Upload Document'}

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={documentUploading}
          onChange={uploadDocument}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  )}

  {documentError && (
    <p style={{ color: '#b42318' }}>
      {documentError}
    </p>
  )}

  {documentNotice && (
    <p style={{ color: '#16703c' }}>
      {documentNotice}
    </p>
  )}

  {documentsLoading ? (
    <p>Loading documents...</p>
  ) : documents.length === 0 ? (
    <p>No documents uploaded yet.</p>
  ) : (
    <div>
      {documents.map(doc => (
        <div
          key={doc.id}
          style={{
            padding: '12px',
            marginBottom: '8px',
            border: '1px solid #dce4ee',
            borderRadius: '8px'
          }}
        >
         
<strong>{doc.file_name}</strong>

{doc.deletion_status === 'deleting' && (
  <p style={{ color: '#92400e', marginTop: '8px' }}>
    Deletion in progress or interrupted.
    Please wait before retrying.
  </p>
)}

{doc.deletion_status === 'delete_failed' && (
  <p style={{ color: '#b42318', marginTop: '8px' }}>
    Previous deletion attempt failed.
    This document needs attention.
  </p>
)}

<p>
  Uploaded: {new Date(doc.created_at).toLocaleString()}
</p>

<p style={{ marginTop: '6px' }}>
  <strong>Uploaded By:</strong>{' '}
  {doc.uploaded_by
    ? documentUploaderNames[doc.uploaded_by] || 'Unknown Employee'
    : 'Unknown Employee'}
</p>

<button
  type="button"
  onClick={() => void viewDocument(doc.file_path)}
  style={{
    marginTop: '10px',
    padding: '8px 14px',
    background: '#1d5f9f',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }}
>
  View / Download
</button>



{canEdit && doc.deletion_status === 'active' && (

  <button
    type="button"
    onClick={() => void deleteDocument(doc)}
    disabled={deletingDocumentId !== null}
    style={{
      marginTop: '10px',
      marginLeft: '10px',
      padding: '8px 14px',
      background: '#b42318',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      cursor:
        deletingDocumentId !== null
          ? 'not-allowed'
          : 'pointer',
      opacity:
        deletingDocumentId !== null ? 0.6 : 1
    }}
  >
    {deletingDocumentId === doc.id
      ? 'Deleting...'
      : 'Delete'}
  </button>
)}

        </div>
      ))}
    </div>
  )}
</section>

{!editing && (
  <section
    style={{
      marginTop: 24,
      paddingTop: 18,
      borderTop: '1px solid #e2e8f0'
    }}
  >
    <h3>Activity History</h3>

    {activityLoading ? (
      <p>Loading activity history...</p>
    ) : activityError ? (
      <p role="alert" style={{ color: 'red' }}>
        Unable to load activity: {activityError}
      </p>
    ) : activities.length === 0 ? (
      <p>No activity recorded yet.</p>
    ) : (
      <div style={{ display: 'grid', gap: 12 }}>
        {activities.map(activity => {
          const oldValues = activity.old_values || {};
          const newValues = activity.new_values || {};

          const changedFields = [
            'customer_name',
            'reference_number',
            'status'
          ].filter(
            field => oldValues[field] !== newValues[field]
          );

          return (
            <div
              key={activity.id}
              style={{
                padding: 12,
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px solid #e2e8f0'
              }}
            >
              <strong>Case Updated</strong>

              <p style={{ fontSize: 12, color: '#64748b' }}>
                {new Date(
                  activity.created_at
                ).toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata'
                })}
              </p>

              {changedFields.map(field => (
                <p key={field}>
                  <strong>
                    {field === 'customer_name'
                      ? 'Customer Name'
                      : field === 'reference_number'
                      ? 'Reference Number'
                      : 'Status'}:
                  </strong>
                  {' '}
                  {field === 'status'
                    ? pretty(oldValues[field] || '')
                    : oldValues[field] || 'Empty'}
                  {' → '}
                  {field === 'status'
                    ? pretty(newValues[field] || '')
                    : newValues[field] || 'Empty'}
                </p>
              ))}

              <p style={{ fontSize: 12, color: '#64748b' }}>
                
Changed by: {activity.changed_by
  ? employeeNames[activity.changed_by] ||
    'Employee name unavailable'
  : 'System'}

              </p>
            </div>
          );
        })}
      </div>
    )}
  </section>
)}

        {errorMessage && (
          <p role="alert" style={{ color: 'red' }}>
            {errorMessage}
          </p>
        )}

        <div style={{
          display: 'flex',
          gap: 10,
          marginTop: 20
        }}>
          {editing ? (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={saveChanges}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditing(false);
                  setErrorMessage('');
                  setCustomerName(selectedCase.customer_name);
                  setReferenceNumber(
                    selectedCase.reference_number || ''
                  );
                  setStatus(selectedCase.status);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              
{selectedCase.module === 'loan_verification' && (
  <button
    type="button"
    onClick={() => setSurveyOpen(true)}
  >
    Site Survey
  </button>
)}

              {canEdit && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                >
                  Edit Case
                </button>
              )}

                <button type="button" onClick={onClose}>
                Close
              </button>

            </>
          )}
        </div>
      </>
    )}
  </div>
</div>
  );
}


/* LOAN VERIFICATION SITE SURVEY */


function LoanVerificationSurvey({
  selectedCase,
  canReview,
}: {
  selectedCase: CaseRow;
  canReview: boolean;
}) {

  const [applicantName, setApplicantName] = useState(
    selectedCase.customer_name
  );

  const [mobileNumber, setMobileNumber] = useState('');
  const [residenceAddress, setResidenceAddress] = useState('');
const [reportNumber, setReportNumber] = useState('');
const [surveyDate, setSurveyDate] = useState('');
const [surveyTime, setSurveyTime] = useState('');
const [dateOfBirth, setDateOfBirth] = useState('');
const [alternateMobile, setAlternateMobile] = useState('');
const [fatherName, setFatherName] = useState('');
const [motherName, setMotherName] = useState('');
const [spouseName, setSpouseName] = useState('');

const [landmark, setLandmark] = useState('');
const [personMet, setPersonMet] = useState('');
const [relationshipWithApplicant, setRelationshipWithApplicant] = useState('');
const [residenceType, setResidenceType] = useState('');
const [ownershipStatus, setOwnershipStatus] = useState('');
const [residingSince, setResidingSince] = useState('');
const [neighbourRemarks, setNeighbourRemarks] = useState('');
const [residenceRemarks, setResidenceRemarks] = useState('');

const [bankName, setBankName] = useState('');
const [branchName, setBranchName] = useState('');
        
const [latitude, setLatitude] = useState('');
const [longitude, setLongitude] = useState('');
const [gpsAddress, setGpsAddress] = useState('');
const [visitRemarks, setVisitRemarks] = useState('');
const [verificationResult, setVerificationResult] = useState('');

const [surveySaving, setSurveySaving] = useState(false);
const [surveyMessage, setSurveyMessage] = useState('');
const [surveyError, setSurveyError] = useState('');

const [surveyLoading, setSurveyLoading] = useState(true);
const [surveyReadOnly, setSurveyReadOnly] = useState(false);

const [reviewRemarks, setReviewRemarks] = useState('');
const [surveyStatus, setSurveyStatus] = useState('draft');
const [reviewSaving, setReviewSaving] = useState(false);

const [reviewedBy, setReviewedBy] = useState('');
const [reviewedAt, setReviewedAt] = useState('');

useEffect(() => {
  if (!supabase) {
    setSurveyError('Supabase is not configured.');
    setSurveyLoading(false);
    return;
  }

  const client = supabase;
  let cancelled = false;

  const loadSurvey = async () => {
    setSurveyLoading(true);
    setSurveyError('');

    const { data, error } = await client
      .from('loan_verification_surveys')
      .select('*')
      .eq('case_id', selectedCase.id)
      .maybeSingle();

    if (cancelled) return;

    if (error) {
      setSurveyError(error.message);
      setSurveyReadOnly(true);
    } else if (data) {
      setReportNumber(data.report_number ?? '');
      setSurveyDate(data.survey_date ?? '');
      setSurveyTime(data.survey_time?.slice(0, 5) ?? '');
      setApplicantName(data.applicant_name ?? '');
      setDateOfBirth(data.date_of_birth ?? '');
      setMobileNumber(data.mobile_number ?? '');
      setAlternateMobile(data.alternate_mobile ?? '');
      setFatherName(data.father_name ?? '');
      setMotherName(data.mother_name ?? '');
      setSpouseName(data.spouse_name ?? '');
      setResidenceAddress(data.residence_address ?? '');
      setLandmark(data.landmark ?? '');
      setPersonMet(data.person_met ?? '');
      setRelationshipWithApplicant(data.relationship_with_applicant ?? '');
      setResidenceType(data.residence_type ?? '');
      setOwnershipStatus(data.ownership_status ?? '');
      setResidingSince(data.residing_since ?? '');
      setNeighbourRemarks(data.neighbour_remarks ?? '');
      setResidenceRemarks(data.residence_remarks ?? '');
      setBankName(data.bank_name ?? '');
      setBranchName(data.branch_name ?? '');
      setLatitude(data.latitude == null ? '' : String(data.latitude));
      setLongitude(data.longitude == null ? '' : String(data.longitude));
      setGpsAddress(data.gps_address ?? '');
      setVisitRemarks(data.visit_remarks ?? '');
      setVerificationResult(data.verification_result ?? '');
      
setSurveyStatus(data.survey_status ?? 'draft');
setReviewRemarks(data.reviewer_remarks ?? '');

setReviewedBy(data.reviewed_by ?? '');
setReviewedAt(data.reviewed_at ?? '');

      setSurveyReadOnly(data.survey_status !== 'draft');
    } else {
      setSurveyReadOnly(false);
    }

    setSurveyLoading(false);
  };

  void loadSurvey();

  return () => {
    cancelled = true;
  };
}, [selectedCase.id]);

const saveSurveyDraft = async () => {
  
if (surveySaving || surveyLoading || surveyReadOnly) {
  setSurveyError(
    'Survey is loading, already saving, or no longer editable.'
  );
  return;
}

  if (!supabase) {
    setSurveyError('Supabase is not configured.');
    return;
  }

  setSurveySaving(true);
  setSurveyError('');
  setSurveyMessage('');

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Please sign in again.');
    }

    const surveyData = {
      case_id: selectedCase.id,
      report_number: reportNumber || null,
      survey_date: surveyDate || null,
      survey_time: surveyTime || null,
      applicant_name: applicantName,
      date_of_birth: dateOfBirth || null,
      mobile_number: mobileNumber || null,
      alternate_mobile: alternateMobile || null,
      father_name: fatherName || null,
      mother_name: motherName || null,
      spouse_name: spouseName || null,
      residence_address: residenceAddress || null,
      landmark: landmark || null,
      person_met: personMet || null,
      relationship_with_applicant: relationshipWithApplicant || null,
      residence_type: residenceType || null,
      ownership_status: ownershipStatus || null,
      residing_since: residingSince || null,
      neighbour_remarks: neighbourRemarks || null,
      residence_remarks: residenceRemarks || null,
      bank_name: bankName || null,
      branch_name: branchName || null,
      latitude: latitude.trim() === '' ? null : Number(latitude),
      longitude: longitude.trim() === '' ? null : Number(longitude),
      gps_address: gpsAddress || null,
      visit_remarks: visitRemarks || null,
      verification_result: verificationResult || null,
      survey_status: 'draft',
      surveyed_by: user.id,
    };

 
const { data: existingSurvey, error: lookupError } = await supabase
  .from('loan_verification_surveys')
  .select('id, survey_status')
  .eq('case_id', selectedCase.id)
  .maybeSingle();

if (lookupError) {
  throw lookupError;
}

if (existingSurvey && existingSurvey.survey_status !== 'draft') {
  throw new Error(
    'This survey has already been submitted or reviewed and cannot be saved as a draft.'
  );
}

const { error: saveError } = existingSurvey
  ? await supabase
      .from('loan_verification_surveys')
      .update(surveyData)
      .eq('id', existingSurvey.id)
  : await supabase
      .from('loan_verification_surveys')
      .insert(surveyData);


    if (saveError) {
      throw saveError;
    }

    setSurveyMessage('Survey draft saved successfully.');
  } catch (error) {
    setSurveyError(
      error instanceof Error ? error.message : 'Unable to save survey.'
    );
  } finally {
    setSurveySaving(false);
  }
};

const submitSurveyForReview = async () => {
  if (surveySaving || surveyLoading || surveyReadOnly) {
    setSurveyError('Survey is not available for submission.');
    return;
  }

  if (!supabase) {
    setSurveyError('Supabase is not configured.');
    return;
  }

  setSurveySaving(true);
  setSurveyError('');
  setSurveyMessage('');

  try {
    const client = supabase;

    const { data: existingSurvey, error: lookupError } =
      await client
        .from('loan_verification_surveys')
        .select('id, survey_status')
        .eq('case_id', selectedCase.id)
        .maybeSingle();

    if (lookupError) throw lookupError;

    if (!existingSurvey) {
      throw new Error(
        'Please save the survey draft before submitting.'
      );
    }

    if (existingSurvey.survey_status !== 'draft') {
      throw new Error('This survey is already submitted or reviewed.');
    }

    const { data: submittedSurvey, error: submitError } =
      await client
        .from('loan_verification_surveys')
        .update({
          survey_status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', existingSurvey.id)
        .eq('survey_status', 'draft')
        .select('id')
        .maybeSingle();

    if (submitError) throw submitError;

    if (!submittedSurvey) {
      throw new Error(
        'Survey could not be submitted. Please reload and try again.'
      );
    }


setSurveyStatus('submitted');
setSurveyReadOnly(true);
setSurveyMessage('Survey submitted for review successfully.');

  } catch (error) {
    setSurveyError(
      error instanceof Error
        ? error.message
        : 'Unable to submit survey.'
    );
  } finally {
    setSurveySaving(false);
  }
};


const reviewSurvey = async (
  decision: 'approved' | 'rejected'
) => {
  if (!canReview || surveyStatus !== 'submitted' || reviewSaving) {
    setSurveyError('Survey is not available for review.');
    return;
  }

  if (decision === 'rejected' && !reviewRemarks.trim()) {
    setSurveyError('Please enter a reason for rejection.');
    return;
  }

if (!supabase) {
  setSurveyError('Supabase is not configured.');
  return;
}

  setReviewSaving(true);
  setSurveyError('');
  setSurveyMessage('');

  try {
    const { data: { user }, error: userError } =
      await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Please sign in again.');
    }

    const { data, error } = await supabase
      .from('loan_verification_surveys')
      .update({
        survey_status: decision,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        reviewer_remarks: reviewRemarks.trim() || null
      })
      .eq('case_id', selectedCase.id)
      .eq('survey_status', 'submitted')
      .select('survey_status')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error('Survey could not be reviewed. Please refresh.');
    }

    setSurveyStatus(decision);
    setSurveyReadOnly(true);
    setSurveyMessage(
      decision === 'approved'
        ? 'Survey approved successfully.'
        : 'Survey rejected successfully.'
    );
  } catch (error) {
    setSurveyError(
      error instanceof Error
        ? error.message
        : 'Unable to review survey.'
    );
  } finally {
    setReviewSaving(false);
  }
};
const downloadSurveyPDF = () => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const ensureSpace = (height: number) => {
    if (y + height > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage();
      y = 20;
    }
  };

  const section = (heading: string) => {
    ensureSpace(15);
    y += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(heading, margin, y);
    y += 8;
  };

  const field = (label: string, value: unknown) => {
    const text = String(value ?? '').trim() || 'Not provided';
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    const lines = pdf.splitTextToSize(
      `${label}: ${text}`,
      contentWidth
    ) as string[];

    ensureSpace(lines.length * 5 + 3);
    pdf.text(lines, margin, y);
    y += lines.length * 5 + 3;
  };

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17);
  pdf.text('MJW TRADING', pageWidth / 2, y, {
    align: 'center'
  });

  y += 10;
  pdf.setFontSize(12);
  pdf.text('LOAN VERIFICATION SITE SURVEY REPORT', pageWidth / 2, y, {
    align: 'center'
  });

  y += 10;

  section('Report Information');
  field('Case ID', selectedCase.case_number);
  field('Report Number', reportNumber);
  field('Survey Date', surveyDate);
  field('Survey Time', surveyTime);

  section('Applicant Information');
  field('Applicant Name', applicantName);
  field('Date of Birth', dateOfBirth);
  field('Mobile Number', mobileNumber);
  field('Alternate Mobile', alternateMobile);
  field('Father Name', fatherName);
  field('Mother Name', motherName);
  field('Spouse Name', spouseName);

  section('Residence Verification');
  field('Residence Address', residenceAddress);
  field('Landmark', landmark);
  field('Person Met', personMet);
  field('Relationship', relationshipWithApplicant);
  field('Residence Type', residenceType);
  field('Ownership Status', ownershipStatus);
  field('Residing Since', residingSince);
  field('Neighbour Remarks', neighbourRemarks);
  field('Residence Remarks', residenceRemarks);

  section('Bank Information');
  field('Bank Name', bankName);
  field('Branch Name', branchName);

  section('GPS Location and Visit Details');
  field('Latitude', latitude);
  field('Longitude', longitude);
  field('GPS Address', gpsAddress);
  field('Visit Remarks', visitRemarks);
  field('Verification Result', verificationResult);

  section('Survey Review Details');
  field('Review Status', surveyStatus.toUpperCase());
  field('Reviewed By', reviewedBy ? 'Super Admin' : 'Not reviewed');
  field(
    'Review Date',
    reviewedAt
      ? new Date(reviewedAt).toLocaleString('en-IN')
      : 'Not reviewed'
  );
  field('Review Remarks', reviewRemarks);

  const totalPages = pdf.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    pdf.setPage(page);
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text(
      `MJW Trading | Page ${page} of ${totalPages}`,
      pageWidth / 2,
      pdf.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  pdf.save(`MJW-Loan-Verification-${selectedCase.case_number}.pdf`);
};
  return (
    <div>
      <h3>Loan Verification Site Survey</h3>

      <p>
        <strong>Case ID:</strong> #{selectedCase.case_number}
      </p>

<h4>Report Details</h4>

<p>
  <label>
    Report Number
    <input
      type="text"
      value={reportNumber}
      onChange={(event) => setReportNumber(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Survey Date
    <input
      type="date"
      value={surveyDate}
      onChange={(event) => setSurveyDate(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Survey Time
    <input
      type="time"
      value={surveyTime}
      onChange={(event) => setSurveyTime(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

      <p>
        <label>
          Applicant Name
          <input
            type="text"
            value={applicantName}
            onChange={(event) =>
              setApplicantName(event.target.value)
            }
            style={{ width: '100%', padding: 10 }}
          />
        </label>
      </p>

<h4>Applicant Personal Details</h4>

<p>
  <label>
    Date of Birth
    <input
      type="date"
      value={dateOfBirth}
      onChange={(event) => setDateOfBirth(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Alternate Mobile Number
    <input
      type="tel"
      value={alternateMobile}
      onChange={(event) => setAlternateMobile(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Father's Name
    <input
      type="text"
      value={fatherName}
      onChange={(event) => setFatherName(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Mother's Name
    <input
      type="text"
      value={motherName}
      onChange={(event) => setMotherName(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Spouse's Name
    <input
      type="text"
      value={spouseName}
      onChange={(event) => setSpouseName(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

      <p>
        <label>
          Mobile Number
          <input
            type="tel"
            value={mobileNumber}
            onChange={(event) =>
              setMobileNumber(event.target.value)
            }
            style={{ width: '100%', padding: 10 }}
          />
        </label>
      </p>

      <p>
        <label>
          Residence Address
          <textarea
            value={residenceAddress}
            onChange={(event) =>
              setResidenceAddress(event.target.value)
            }
            style={{ width: '100%', padding: 10 }}
          />
        </label>
      </p>
      
<h4>Residence Verification Details</h4>

<p>
  <label>
    Landmark
    <input
      type="text"
      value={landmark}
      onChange={(event) => setLandmark(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Person Met During Visit
    <input
      type="text"
      value={personMet}
      onChange={(event) => setPersonMet(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Relationship with Applicant
    <input
      type="text"
      value={relationshipWithApplicant}
      onChange={(event) =>
        setRelationshipWithApplicant(event.target.value)
      }
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Residence Type
    <select
      value={residenceType}
      onChange={(event) => setResidenceType(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    >
      <option value="">Select Residence Type</option>
      <option value="house">House</option>
      <option value="flat">Flat / Apartment</option>
      <option value="other">Other</option>
    </select>
  </label>
</p>

<p>
  <label>
    Ownership Status
    <select
      value={ownershipStatus}
      onChange={(event) => setOwnershipStatus(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    >
      <option value="">Select Ownership Status</option>
      <option value="owned">Owned</option>
      <option value="rented">Rented</option>
      <option value="family">Family Property</option>
      <option value="other">Other</option>
    </select>
  </label>
</p>

<p>
  <label>
    Residing Since
    <input
      type="text"
      value={residingSince}
      onChange={(event) => setResidingSince(event.target.value)}
      placeholder="Example: 5 years"
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Neighbour Remarks
    <textarea
      value={neighbourRemarks}
      onChange={(event) => setNeighbourRemarks(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Residence Remarks
    <textarea
      value={residenceRemarks}
      onChange={(event) => setResidenceRemarks(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<h4>Bank Details</h4>

<p>
  <label>
    Bank Name
    <input
      type="text"
      value={bankName}
      onChange={(event) => setBankName(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Branch Name
    <input
      type="text"
      value={branchName}
      onChange={(event) => setBranchName(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<h4>GPS Location and Visit Details</h4>

<p>
  <label>
    Latitude
    <input
      type="number"
      step="any"
      value={latitude}
      onChange={(event) => setLatitude(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Longitude
    <input
      type="number"
      step="any"
      value={longitude}
      onChange={(event) => setLongitude(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    GPS Address
    <textarea
      value={gpsAddress}
      onChange={(event) => setGpsAddress(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Visit Remarks
    <textarea
      value={visitRemarks}
      onChange={(event) => setVisitRemarks(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    />
  </label>
</p>

<p>
  <label>
    Verification Result
    <select
      value={verificationResult}
      onChange={(event) => setVerificationResult(event.target.value)}
      style={{ width: '100%', padding: 10 }}
    >
      <option value="">Select Verification Result</option>
      <option value="positive">Positive</option>
      <option value="negative">Negative</option>
      <option value="refer">Refer</option>
    </select>
  </label>
</p>

{/* Survey Save Messages */}

{surveyError && (
  <p style={{ color: 'red' }}>
    {surveyError}
  </p>
)}

{surveyMessage && (
  <p style={{ color: 'green' }}>
    {surveyMessage}
  </p>
)}

{/* Save Draft Button */}

{surveyReadOnly && (
  <p style={{ color: '#92400e' }}>
    This survey is no longer a draft. Changes cannot be saved.
  </p>
)}

<div style={{ marginTop: 20 }}>
  <button
    type="button"
    disabled={surveySaving || surveyLoading || surveyReadOnly}
    onClick={saveSurveyDraft}
    style={{
      padding: '12px 24px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: 6,
      cursor: surveySaving ? 'not-allowed' : 'pointer',
    }}
  >
    

{surveyLoading
  ? 'Loading Survey...'
  : surveyStatus === 'approved'
  ? 'Survey Approved / Locked'
  : surveyStatus === 'rejected'
  ? 'Survey Rejected / Locked'
  : surveyReadOnly
  ? 'Survey Submitted / Locked'
  : surveySaving
  ? 'Saving Draft...'
  : 'Save Draft'}


  </button>
 {surveyStatus === 'draft' && ( 
<button
  type="button"
  disabled={surveySaving || surveyLoading || surveyReadOnly}
  onClick={submitSurveyForReview}
  style={{
    padding: '12px 24px',
    marginLeft: 10,
    backgroundColor: '#15803d',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor:
      surveySaving || surveyLoading || surveyReadOnly
        ? 'not-allowed'
        : 'pointer',
  }}
>
  Submit for Review
</button>
)}
</div>

{(surveyStatus === 'approved' || surveyStatus === 'rejected') && (
  <section style={{ marginTop: 24 }}>
    <h3>Survey Review Details</h3>

    <p>
      <strong>Review Status: </strong>
      {surveyStatus === 'approved' ? 'Approved' : 'Rejected'}
    </p>

    <p>
      <strong>Reviewed By: </strong>
      {reviewedBy ? 'Super Admin' : 'Not available'}
    </p>

    <p>
      <strong>Review Date: </strong>
      {reviewedAt
        ? new Date(reviewedAt).toLocaleString('en-IN')
        : 'Not available'}
    </p>

    <p>
      <strong>Review Remarks: </strong>
      {reviewRemarks || 'No remarks provided'}
    </p>
  </section>
)}
{(surveyStatus === 'approved' || surveyStatus === 'rejected') && (
  <button
    type="button"
    onClick={downloadSurveyPdf}
    style={{
      marginTop: 20,
      padding: '12px 24px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      fontWeight: 600
    }}
  >
    Download PDF Report
  </button>
)}
{canReview && surveyStatus === 'submitted' && (
  <section style={{ marginTop: 24 }}>
    <h3>Super Admin Review</h3>

    <label>
      Review Remarks
      <textarea
        value={reviewRemarks}
        onChange={(event) =>
          setReviewRemarks(event.target.value)
        }
        rows={4}
        style={{ width: '100%', padding: 10, marginTop: 8 }}
        placeholder="Enter approval comments or rejection reason"
      />
    </label>

    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
      <button
        type="button"
        disabled={reviewSaving}
        onClick={() => void reviewSurvey('approved')}
        style={{
          background: '#15803d',
          color: '#fff',
          padding: '12px 18px',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        {reviewSaving ? 'Processing...' : 'Approve Survey'}
      </button>

      <button
        type="button"
        disabled={reviewSaving}
        onClick={() => void reviewSurvey('rejected')}
        style={{
          background: '#b91c1c',
          color: '#fff',
          padding: '12px 18px',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        Reject Survey
      </button>
    </div>
  </section>
)}

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
  
const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null);


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

 
if (
  !session?.user ||
  !['super_admin', 'agent'].includes(profile?.role ?? '')
) {
  setNotice('Only Super Admins and Agents can create cases.');
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
              'id,case_number,module,status,customer_name,reference_number,created_at,assigned_to'
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

              <CaseTable
  rows={cases}
  onSelectCase={(selectedCase) => setSelectedCase(selectedCase)}
/>
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

              
<CaseTable
  rows={filtered}
  onSelectCase={setSelectedCase}
/>

            </>
          )}
        </div>

        <footer>
          © {new Date().getFullYear()} MJW TRADING
          <span> · </span>
          Secure Management Portal
        </footer>
      </main>
      

{selectedCase && (
  <CaseDetails
    selectedCase={selectedCase}
    onClose={() => setSelectedCase(null)}
    canEdit={
  profile?.role === 'super_admin' ||
  profile?.role === 'agent'
}
    canAssign={profile?.role === 'super_admin'}
    canUploadDocuments={
  profile?.role === 'super_admin' ||
  profile?.role === 'agent'
}
    onSaved={(updatedCase) => {
      setCases(previous =>
        previous.map(item =>
          item.id === updatedCase.id
            ? updatedCase
            : item
        )
      );
      setSelectedCase(updatedCase);
    }}
  />
)}


    </div>
  );
}

export default App;
