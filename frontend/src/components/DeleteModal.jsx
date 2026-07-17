import { AlertTriangle, X, Trash2 } from "lucide-react";

// LinkedIn blue palette tokens
const C = {
  primary: "var(--c-primary)",
  primaryDk: "var(--c-primary-dk)",
  primaryDkr: "var(--c-primary-dkr)",
  primaryLt: "var(--c-primary-lt)",
  primaryBdr: "var(--c-primary-bdr)",
  dark: "var(--c-dark)",
  muted: "var(--c-muted-txt)",
  card: "var(--c-card)",
  bg: "var(--c-bg)",
};

export function DeleteModal({ open, onClose, onConfirm, loading }) {
  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes dm-fadeIn  { from{opacity:0}                             to{opacity:1} }
        @keyframes dm-slideUp { from{opacity:0;transform:scale(.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position:"fixed", inset:0, zIndex:200,
          background:"rgba(0,65,130,0.35)",
          backdropFilter:"blur(5px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"dm-fadeIn .2s ease",
        }}
      >
        {/* Modal card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: C.card,
            borderRadius:22,
            width:"100%", maxWidth:400,
            margin:16,
            boxShadow:"0 24px 64px rgba(0,65,130,0.22)",
            overflow:"hidden",
            animation:"dm-slideUp .25s ease",
            border:`1px solid ${C.primaryBdr}`,
          }}
        >
          {/* Header stripe */}
          <div style={{
            height:4,
            background:`linear-gradient(to right, ${C.primary}, ${C.primaryDk})`,
          }} />

          {/* Header */}
          <div style={{
            padding:"22px 24px 16px",
            display:"flex", alignItems:"center", gap:14,
            borderBottom:`1px solid ${C.primaryLt}`,
          }}>
            {/* Warning icon */}
            <div style={{
              width:44, height:44, borderRadius:12,
              background:"#fef2f2",
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0,
              border:"1px solid #fecaca",
            }}>
              <AlertTriangle size={20} color="#ef4444" />
            </div>

            <div style={{flex:1}}>
              <div style={{fontSize:16, fontWeight:700, color:C.dark}}>Delete resume?</div>
              <div style={{fontSize:12, color:C.muted, marginTop:3}}>This action cannot be undone</div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                width:30, height:30, borderRadius:8,
                background:C.primaryLt, border:`1px solid ${C.primaryBdr}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", color:C.primary, transition:"all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.primaryBdr; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.primaryLt; }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div style={{
            padding:"18px 24px 20px",
            fontSize:14, color: C.muted, lineHeight:1.65,
            background: C.bg,
          }}>
            Are you sure you want to permanently delete this resume?
            All content and data associated with it will be lost forever.
          </div>

          {/* Actions */}
          <div style={{
            padding:"16px 24px",
            borderTop:`1px solid ${C.primaryLt}`,
            background: C.card,
            display:"flex", justifyContent:"flex-end", gap:10,
          }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                padding:"9px 20px", borderRadius:10,
                fontSize:14, fontWeight:500,
                color:C.primary, background:C.primaryLt,
                border:`1.5px solid ${C.primaryBdr}`,
                cursor:"pointer", transition:"all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.primaryBdr; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.primaryLt; }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                padding:"9px 20px", borderRadius:10,
                fontSize:14, fontWeight:600,
                color:"#fff",
                background: loading
                  ? "#fca5a5"
                  : "linear-gradient(135deg, #ef4444, #dc2626)",
                border:"none",
                cursor: loading ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", gap:7,
                transition:"all .15s",
                boxShadow: loading ? "none" : "0 2px 10px rgba(239,68,68,0.3)",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = ".9"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              {loading ? (
                <>
                  <span style={{
                    width:14, height:14, borderRadius:"50%",
                    border:"2px solid rgba(255,255,255,.4)",
                    borderTopColor:"#fff",
                    display:"inline-block",
                    animation:"dm-spin .7s linear infinite",
                  }} />
                  Deleting…
                </>
              ) : (
                <><Trash2 size={14} /> Delete Forever</>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes dm-spin { to{ transform:rotate(360deg) } }`}</style>
    </>
  );
}
