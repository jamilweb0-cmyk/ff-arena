import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl text-gray-300 mt-4">Page Not Found</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-white">Back Home</Link>
    </div>
  );
};

export default ErrorPage;