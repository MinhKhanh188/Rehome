// front-end/src/components/pages/dashboard/Dashboard.js
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import MyListings from './MyListings';
// import EditListing from '/EditListing';
import PurchaseHistory from './PurchaseHistory';
import Analytics from './Analytics';
import Settings from './Settings';
import ProductForm from './ProductForm';
import { NavbarComponent } from '../layout/Navbar';
import Chat from './chat/Chat';
import BuyCoin from './BuyCoin';
import ViewSavedPost from './ViewSavedPost';

export default function Dashboard() {
  return (
    <div className='dashboard-container'>
      <NavbarComponent />
      <div className='section'
        style={{
          margin: '40px auto',
          maxWidth: '1300px',
          padding: '0 20px'
        }}>
        <DashboardLayout>
          <Routes>
            <Route index element={<MyListings />} />
            <Route path="new-listing" element={<ProductForm />} />
            <Route path="chat/*" element={<Chat />} />
            <Route path="saved-post" element={<ViewSavedPost />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="purchases" element={<PurchaseHistory />} />
            <Route path="purchasesCoins" element={<BuyCoin />} />
            <Route path="settings" element={<Settings />} />
            {/* <Route path="edit/:id" element={<EditListing />} />
         />
        
        
         */}
          </Routes>
        </DashboardLayout>
      </div>

    </div>

  );
}