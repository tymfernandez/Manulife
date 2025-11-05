import { useEffect, useState } from 'react';

export default function DebugReset() {
  const [urlInfo, setUrlInfo] = useState({});

  useEffect(() => {
    const fullUrl = window.location.href;
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.substring(1));
    
    setUrlInfo({
      fullUrl,
      hash,
      type: hashParams.get('type'),
      accessToken: hashParams.get('access_token'),
      refreshToken: hashParams.get('refresh_token'),
      hasTokens: !!(hashParams.get('access_token') && hashParams.get('refresh_token'))
    });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Debug Reset Password URL</h1>
        <div className="space-y-2 text-sm">
          <p><strong>Full URL:</strong> {urlInfo.fullUrl}</p>
          <p><strong>Hash:</strong> {urlInfo.hash}</p>
          <p><strong>Type:</strong> {urlInfo.type}</p>
          <p><strong>Has Access Token:</strong> {urlInfo.accessToken ? 'Yes' : 'No'}</p>
          <p><strong>Has Refresh Token:</strong> {urlInfo.refreshToken ? 'Yes' : 'No'}</p>
          <p><strong>Valid Reset Link:</strong> {urlInfo.hasTokens ? 'Yes' : 'No'}</p>
        </div>
        
        {urlInfo.hasTokens ? (
          <div className="mt-4 p-4 bg-green-50 rounded">
            <p className="text-green-700">✅ Valid reset link detected!</p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-red-50 rounded">
            <p className="text-red-700">❌ No valid tokens found in URL</p>
          </div>
        )}
      </div>
    </div>
  );
}