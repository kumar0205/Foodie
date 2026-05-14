import { assets } from '../../assets/assets'; // Adjust path if needed
import './Add.css'; // Make sure to import the CSS file
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have react-hot-toast installed for
const Add = ({url}) => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        category: 'Salad',
        price: ''
    })

    useEffect(() => {
        console.log(data)
    }, [data])

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({...data, [name]: value }));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', Number(data.price));

        const response = await axios.post(`${url}/api/food/add`, formData);
        if(response.data.success) {
            toast.success(response.data.message);
            setData({
                name: '',
                description: '',
                category: 'Salad',
                price: ''
            });
            setImage(false);
        }else {
            toast.error(response.data.message);
        }
    }
  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        {/* The extra <div> wrapper has been removed from here */}
        
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="Upload Area" />
          </label>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>

        <div className='add-product-name flex-col'>
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here' required />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write content here..." required />
        </div>

        {/* This container will now be controlled by flexbox row */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" required>
              <option value="Fish">Fish</option>
              <option value="Prawns">Prawns</option>
              <option value="Kamju">Kamju</option>
              <option value="Indian Bread">Indian Bread</option>
              <option value="Rice">Rice</option>
              <option value="Ice Cream">Ice Cream</option>
              <option value="Milk Shakes">Milk Shakes</option>
              <option value="Family Packs">Family Packs</option>
              <option value="Veg Biryani">Veg Biryani</option>
              <option value="Biryani">Biryani</option>
              <option value="Chicken Dry">Chicken Dry</option>
              <option value="Tandoori">Tandoori</option>
              <option value="Veg Dry">Veg Dry</option>
              <option value="Tandoori Veg">Tandoori Veg</option>
              <option value="Mutton">Mutton</option>
              <option value="Egg">Egg</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='$20' required />
          </div>
        </div>

        <button type='submit' className='add-btn'>ADD</button>
        
      </form>
    </div>
  );
};

export default Add;
