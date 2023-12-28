import './style.css';

export default function ProcessedTable({ activated, alreadyActive }) {
  if (!activated && !alreadyActive) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>ACTIVATED</th>
          <th>ALREADY ACTIVE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{activated}</td>
          <td>{alreadyActive}</td>
        </tr>
      </tbody>
    </table>
  );
}
