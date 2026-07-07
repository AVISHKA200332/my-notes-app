import Navbar from '../components/Navbar';

/**
 * Main dashboard — note list and creation will be wired up here.
 * TODO: Fetch and render notes using notesApi.js
 */
const DashboardPage = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <h1>My Notes</h1>
        <p>Notes will appear here. Start implementing the notes CRUD!</p>
      </main>
    </>
  );
};

export default DashboardPage;
