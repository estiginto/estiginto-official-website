import './orbitalMark.css';

export default function OrbitalMark() {
  return (
    <div className="orbital-background" aria-hidden="true">
      <svg className="orbital-outline" viewBox="0 0 400 400" focusable="false">
        <circle cx="200" cy="200" r="174" />
        <circle className="orbital-dot" cx="200" cy="26" r="3" />
        <circle className="orbital-dot" cx="77" cy="323" r="2" />
      </svg>
      <div className="orbital-axis">
        <svg className="orbital-ring" viewBox="0 0 400 400" focusable="false">
          <circle cx="200" cy="200" r="145" />
          <circle className="orbital-dot" cx="200" cy="55" r="3" />
          <circle className="orbital-dot" cx="200" cy="345" r="3" />
        </svg>
      </div>
    </div>
  );
}
