import { Route, Routes } from 'react-router-dom';

import MainPage from '../components/pages/MainPage';
import SecondPage from '../components/pages/SecondPage';

const Router = () => {
    return (
        <Routes>
            <Route path="/" index element={<MainPage />} />
            <Route path='/second' element={<SecondPage />} />
        </Routes>
    );
};

export default Router;