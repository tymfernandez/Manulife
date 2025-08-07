import ApplicationForm from './ApplicationForm/applicationForm';
import Layout from './components/Layout';
import Dashboard from './Dashboard/dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ApplicationForm />
    </div>
  )
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App