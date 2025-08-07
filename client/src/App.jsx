import ApplicationForm from './ApplicationForm/applicationForm';
<<<<<<< HEAD
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
=======

function App() {
  return (
    <Layout>
      <Dashboard />
      <ApplicationForm />
>>>>>>> main
    </Layout>
  );
}

export default App