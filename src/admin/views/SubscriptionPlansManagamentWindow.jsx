import React, { useState, useEffect } from 'react';
import './SubscriptionPlansmanagementWindow.css';
import LeftSidebar from '../common/LeftSidebar';
import RightSidebar from '../common/RightSidebar';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';

const SubscriptionPlansManagementWindow = () => {
  const [plans, setPlans] = useState([
    { subscriptionPlanId: 1, subscriptionPlanName: 'Plan 1', subscriptionPlanDescription: '', subscriptionPlanPrice: '', selected: false },
    { subscriptionPlanId: 2, subscriptionPlanName: 'Plan 2', subscriptionPlanDescription: '', subscriptionPlanPrice: '', selected: false },
    { subscriptionPlanId: 3, subscriptionPlanName: 'Plan 3', subscriptionPlanDescription: '', subscriptionPlanPrice: '', selected: false },
  ]);

  useEffect(() => {
    // Backend developer: Fetch user data from the backend and update state
    // Example:
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8095/subscriptionPlan/subscriptionPlan');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (id, field, value) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => (plan.subscriptionPlanId === id ? { ...plan, [field]: value } : plan))
    );
  };

  const handleSave = () => {
    setEditMode(false);
    axios.put('http://localhost:8095/subscriptionPlan/updateMultipleSubscriptionPlans', plans)
      .then(response => {
        alert('Plan Updated Successfully!');
      })
      .catch(error => {
        console.error('Error saving plans:', error);
        alert('Failed to save plans. Please try again.');
      });
  };

  const [newPlan, setNewPlan] = useState({
    subscriptionPlanName: '',
    subscriptionPlanDescription: '',
    subscriptionPlanPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8095/subscriptionPlan/addSubscriptionPlan', newPlan);
      alert('Subscription Plan Successfully Added');
      setNewPlan({
        subscriptionPlanName: '',
        subscriptionPlanDescription: '',
        subscriptionPlanPrice: '',
      });
      fetchData(); // Fetch latest plans after adding new plan
    } catch (err) {
      alert(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8095/subscriptionPlan/deleteSubscriptionPlan/${id}`);
      alert('Subscription Plan Deleted Successfully');
      fetchData(); // Fetch latest plans after deleting a plan
    } catch (err) {
      console.error('Error deleting plan:', err);
      alert('Failed to delete plan. Please try again.');
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="subscription-plans-management">
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <FaBars />
      </div>

      <div className={`left-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <LeftSidebar />
      </div>

      <div className="subscription-plans-management-content">

        <div className='add-plan-wrapper-subscription'>
          <h2 className='subscription-management-heading'>Subscription Plans Management</h2>
          <div className='add-plan-subscription'>
            <form className="plan-form-subscription" onSubmit={handleFormSubmit}>
              <h3 className='subscription-management-heading'>Add New Subscription Plan</h3>
              <label>Name</label>
              <input className='input-subscription'
                type="text"
                name="subscriptionPlanName"
                value={newPlan.subscriptionPlanName}
                onChange={handleChange}
              />
              <br />
              <label>Description:</label>
              <input className='input-subscription'
                type="text"
                name="subscriptionPlanDescription"
                value={newPlan.subscriptionPlanDescription}
                onChange={handleChange}
              />
              <br />
              <label>Price:</label>
              <input className='input-subscription'
                type="text"
                name="subscriptionPlanPrice"
                value={newPlan.subscriptionPlanPrice}
                onChange={handleChange}
              />
              <button className="save-button-subscription" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>

        {plans.map((plan) => (
          <div key={plan.subscriptionPlanId} className="plan-item-subscription">
            <label>
              <input className='input-subscription'
                type="checkbox"
                checked={plan.selected}
                onChange={() =>
                  setPlans((prevPlans) =>
                    prevPlans.map((p) => (p.subscriptionPlanId === plan.subscriptionPlanId ? { ...p, selected: !p.selected } : p))
                  )
                }
              />
              {plan.subscriptionPlanName}
            </label>
            {plan.selected && (
              <form className="plan-form-subscription">
                <label>{`Plan ${plan.subscriptionPlanId} Name:`}</label>
                <input className='input-subscription'
                  type="text"
                  value={plan.subscriptionPlanName}
                  onChange={(e) => handleInputChange(plan.subscriptionPlanId, 'subscriptionPlanName', e.target.value)}
                  readOnly={!editMode}
                />
                <br />
                <label>Description:</label>
                <input className='input-subscription'
                  type="text"
                  value={plan.subscriptionPlanDescription}
                  onChange={(e) => handleInputChange(plan.subscriptionPlanId, 'subscriptionPlanDescription', e.target.value)}
                  readOnly={!editMode}
                />
                <br />
                <label>Price:</label>
                <input className='input-subscription'
                  type="text"
                  value={plan.subscriptionPlanPrice}
                  onChange={(e) => handleInputChange(plan.subscriptionPlanId, 'subscriptionPlanPrice', e.target.value)}
                  readOnly={!editMode}
                />
              </form>
            )}
            <div className="subscription-plans-management-buttons">
              <button
                className={`edit-button-subscription ${editMode ? 'active' : ''}`}
                onClick={() => setEditMode(!editMode)}
              >
                Edit
              </button>
              <button className="save-button-subscription" onClick={handleSave} disabled={!editMode}>
                Save
              </button>
              <button className="delete-button-subscription" onClick={() => handleDelete(plan.subscriptionPlanId)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <RightSidebar />
    </div>
  );
};

export default SubscriptionPlansManagementWindow;
