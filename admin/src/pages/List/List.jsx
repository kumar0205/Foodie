import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './List.css';

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [editItem, setEditItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newImage, setNewImage] = useState(false);

    const categories = ["All", "Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

    const fetchList = async () => {
        const response = await axios.get(`${url}api/food/list`);
        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error fetching food list");
        }
    };

    const removeFood = async (foodId) => {
        const response = await axios.post(`${url}api/food/remove`, { id: foodId });
        if (response.data.success) {
            toast.success(response.data.message);
            await fetchList();
        } else {
            toast.error("Error removing food item");
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        const response = await axios.post(`${url}api/food/toggle-availability`, { id, available: !currentStatus });
        if (response.data.success) {
            toast.success(response.data.message);
            await fetchList();
        }
    };

    const handleEdit = (item) => {
        setEditItem({ ...item });
        setShowModal(true);
        setNewImage(false);
    };

    const onEditChange = (e) => {
        const { name, value } = e.target;
        setEditItem(prev => ({ ...prev, [name]: value }));
    };

    const onUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", editItem._id);
        formData.append("name", editItem.name);
        formData.append("description", editItem.description);
        formData.append("price", editItem.price);
        formData.append("category", editItem.category);
        formData.append("available", editItem.available);
        if (newImage) {
            formData.append("image", newImage);
        }

        const response = await axios.post(`${url}api/food/update`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setShowModal(false);
            await fetchList();
        } else {
            toast.error(response.data.message);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // Filtered list based on search term
    const filteredList = list.filter((item) => {
        const matchName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = category === 'All' || item.category === category;
        return matchName && matchCategory;
    });

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>

            {/* 🔍 Search Bar */}
            <input
                type='text'
                placeholder='Search recipes by name...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='search-input'
                style={{
                    padding: '10px',
                    marginBottom: '20px',
                    width: '100%',
                    maxWidth: '400px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc'
                }}
            />

            {/* 📁 Categories */}
            <div className='category-filters' style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`category-btn ${category === cat ? 'active' : ''}`}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                            backgroundColor: category === cat ? '#ff6347' : 'white',
                            color: category === cat ? 'white' : '#6d6d6d'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className='list-table'>
                <div className='list-table-format title'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Available</b>
                    <b>Action</b>
                </div>

                {filteredList.length === 0 ? (
                    <p style={{ padding: '20px', fontStyle: 'italic' }}>No recipes found.</p>
                ) : (
                    filteredList.map((item, index) => (
                        <div className='list-table-format' key={index}>
                            <img src={item.image.startsWith("http") ? item.image : `${url}images/${item.image}`} alt={item.name} />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>${item.price}</p>
                            <div className="toggle-container" onClick={() => toggleAvailability(item._id, item.available !== false)}>
                                <div className={`toggle-switch ${item.available !== false ? 'on' : 'off'}`}>
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                            <div className='list-actions'>
                                <button onClick={() => handleEdit(item)} className='edit-btn'>✎</button>
                                <button onClick={() => removeFood(item._id)} className='remove-btn'>X</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 📝 Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Food Item</h2>
                        <form onSubmit={onUpdate}>
                            <div className="modal-body">
                                <div className="add-img-upload flex-col">
                                    <p>Upload Image</p>
                                    <label htmlFor="image">
                                        <img src={newImage ? URL.createObjectURL(newImage) : (editItem.image.startsWith("http") ? editItem.image : `${url}images/${editItem.image}`)} alt="" style={{ width: '120px' }} />
                                    </label>
                                    <input onChange={(e) => setNewImage(e.target.files[0])} type="file" id="image" hidden />
                                </div>
                                <div className="add-product-name flex-col">
                                    <p>Product name</p>
                                    <input onChange={onEditChange} value={editItem.name} name='name' type="text" placeholder='Type here' required />
                                </div>
                                <div className="add-product-description flex-col">
                                    <p>Product description</p>
                                    <textarea onChange={onEditChange} value={editItem.description} name="description" rows="6" placeholder='Write content here' required></textarea>
                                </div>
                                <div className="add-category-price">
                                    <div className="add-category flex-col">
                                        <p>Product category</p>
                                        <select onChange={onEditChange} value={editItem.category} name="category">
                                            {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="add-price flex-col">
                                        <p>Product price</p>
                                        <input onChange={onEditChange} value={editItem.price} name='price' type="Number" placeholder='$20' required />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className='cancel-btn'>Cancel</button>
                                <button type="submit" className='save-btn'>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default List;
