import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Process from './Process';
import Layout from './Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/process' element={<Process />} />
      </Route>
    </Routes>
  );
}

export default App;
