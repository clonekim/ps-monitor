import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Process from './Process';
import Log from './Log';
import Layout from './Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Process />} />
        <Route path="/Log" element={<Log />} />
      </Route>
    </Routes>
  );
}

export default App;
