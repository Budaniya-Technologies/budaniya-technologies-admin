// import { useEffect, useState } from 'react';
// import { Dialog, Checkbox, FormControlLabel, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Snackbar, SnackbarContent, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material';
// import { apiPost, apiPut } from '../../../api/apiMethods';
// import { EditNoteOutlined } from '@mui/icons-material';
// import { useUser } from '../../../Context/UserContext';

// const ProductForm = ({ dataHandler, initialData, websites, addCategory }) => {
//   const [open, setOpen] = useState(false);
//   const [productName, setProductName] = useState('');
//   const [description, setDescription] = useState('');
//   const [images, setImages] = useState('');
//   const [price, setPrice] = useState(0);
//   const [technologies, setTechnologies] = useState([]);
//   const [discount, setDiscount] = useState(0);
//   const [referenceWebsite, setReferenceWebsite] = useState('');
//   const [category, setCategory] = useState('');
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');
//   const { user, categories, setCategories } = useUser();

//   useEffect(() => {
//     if (initialData) {
//       setProductName(initialData?.productName || '');
//       setDescription(initialData?.description || '');
//       setImages(initialData?.images?.join(', ') || '');
//       setPrice(initialData?.price || 0);
//       setTechnologies(initialData?.technologies || []);
//       setDiscount(initialData?.discount || 0);
//       setReferenceWebsite(initialData?.referenceWebsite || '');
//       setCategory(initialData?.category?._id || '');
//     } else {
//       resetForm();
//     }
//   }, [initialData]);

//   useEffect(() => {
//     if (user) {
//       setReferenceWebsite(user.referenceWebsite);
//     }
//   }, [user]);

//   const resetForm = () => {
//     setProductName('');
//     setDescription('');
//     setImages('');
//     setPrice(0);
//     setTechnologies([]);
//     setDiscount(0);
//     setReferenceWebsite('');
//     setCategory('');
//   };

//   const handleSubmit = async () => {
//     if ((!addCategory && (!productName || !description || !images || !price || !referenceWebsite || !category)) || (addCategory && !productName)) {
//       setSnackbarMessage('Please fill all required fields');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     const newProduct = {
//       productName,
//       description,
//       images: images.split(',').map((img) => img.trim()),
//       price,
//       actualPrice: (price * (100 - discount) / 100).toFixed(2),
//       technologies,
//       discount,
//       referenceWebsite,
//       category,
//     };

//     const newCategory = {
//       name: productName,
//       referenceWebsite: import.meta.env.VITE_API_REFERENCE_WEBSITE,
//     };

//     if (addCategory) {
//       try {
//         const { data } = await apiPost('api/categories', newCategory);
//         setCategories(prevCategories => [...prevCategories, data.category]);
//         handleClose();
//       } catch (error) {
//         console.log(error.message);
//       }
//       return;
//     }

//     try {
//       const response = initialData
//         ? await apiPut(`api/product/products/${initialData._id}`, newProduct)
//         : await apiPost('api/product/createproduct', newProduct);

//       if (response.status === 200) {
//         setSnackbarMessage('Product saved successfully');
//         setSnackbarSeverity('success');
//         setOpen(false);
//         dataHandler();
//       }
//     } catch (error) {
//       setSnackbarMessage('Failed to save product');
//       setSnackbarSeverity('error');
//     }
//     setSnackbarOpen(true);
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <div>
//       {initialData ? (
//         <IconButton onClick={handleClickOpen}>
//           <EditNoteOutlined />
//         </IconButton>
//       ) : user && (user.role === 'admin' || user.role === 'vendor') ? (
//         !addCategory ? (
//           <Button variant="contained" color="primary" onClick={handleClickOpen}>
//             New Product
//           </Button>
//         ) : (
//           <Button variant="contained" color="primary" onClick={handleClickOpen}>
//             Add Category
//           </Button>
//         )
//       ) : null}

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>{initialData ? 'Update Product' : addCategory ? 'Add Category' : 'New Product'}</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label={addCategory ? 'Add category' : 'Product Name'}
//                 variant="outlined"
//                 required
//                 value={productName}
//                 sx={{ marginTop: 1 }}
//                 onChange={(e) => setProductName(e.target.value)}
//               />
//             </Grid>

//             {!addCategory && (
//               <>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Description"
//                     variant="outlined"
//                     required
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Images (comma-separated)"
//                     variant="outlined"
//                     required
//                     value={images}
//                     onChange={(e) => setImages(e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Price"
//                     variant="outlined"
//                     type="number"
//                     required
//                     value={price}
//                     onChange={(e) => setPrice(Number(e.target.value))}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Discount (%)"
//                     variant="outlined"
//                     type="number"
//                     value={discount}
//                     onChange={(e) => setDiscount(Number(e.target.value))}
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <FormControl fullWidth>
//                     <InputLabel>Technologies</InputLabel>
//                     <Select
//                       multiple
//                       value={technologies}
//                       onChange={(e) => setTechnologies(e.target.value)}
//                       renderValue={(selected) => selected.join(', ')}
//                     >
//                       {['React', 'Node.js', 'MongoDB', 'Express', 'Next.js', 'TypeScript'].map((tech) => (
//                         <MenuItem key={tech} value={tech}>
//                           <Checkbox checked={technologies.indexOf(tech) > -1} />
//                           {tech}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <FormControl fullWidth>
//                     <InputLabel>Category</InputLabel>
//                     <Select
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                     >
//                       {categories.map((cat) => (
//                         <MenuItem key={cat._id} value={cat._id}>
//                           {cat.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </>
//             )}
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color="primary" variant="contained">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//       >
//         <SnackbarContent
//           message={snackbarMessage}
//           style={{
//             backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
//           }}
//         />
//       </Snackbar>
//     </div>
//   );
// };

// export default ProductForm;


import { useEffect, useState } from 'react';
import { Dialog, Checkbox, FormControlLabel, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Snackbar, SnackbarContent, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material';
import { apiPost, apiPut } from '../../../api/apiMethods';
import { EditNoteOutlined } from '@mui/icons-material';
import { useUser } from '../../../Context/UserContext';

const ProductForm = ({ dataHandler, initialData, websites, addCategory }) => {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [price, setPrice] = useState(0);
  const [technologies, setTechnologies] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [referenceWebsite, setReferenceWebsite] = useState('');
  const [category, setCategory] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { user, categories, setCategories } = useUser();

  useEffect(() => {
    if (initialData) {
      setProductName(initialData?.productName || '');
      setDescription(initialData?.description || '');
      setImages(initialData?.images?.join(', ') || '');
      setPrice(initialData?.price || 0);
      setTechnologies(initialData?.technologies || []);
      setDiscount(initialData?.discount || 0);
      setReferenceWebsite(initialData?.referenceWebsite || '');
      setCategory(initialData?.category?._id || '');
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    if (user) {
      setReferenceWebsite(user.referenceWebsite);
    }
  }, [user]);

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setImages('');
    setPrice(0);
    setTechnologies([]);
    setDiscount(0);
    setReferenceWebsite('');
    setCategory('');
  };

  const handleSubmit = async () => {
    if ((!addCategory && (!productName || !description || !images || !price || !referenceWebsite || !category)) || (addCategory && !productName)) {
      setSnackbarMessage('Please fill all required fields');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const newProduct = {
      productName,
      description,
      images: images.split(',').map((img) => img.trim()),
      price,
      actualPrice: (price * (100 - discount) / 100).toFixed(2),
      technologies,
      discount,
      referenceWebsite,
      category,
    };

    const newCategory = {
      name: productName,
      referenceWebsite: import.meta.env.VITE_API_REFERENCE_WEBSITE,
    };

    if (addCategory) {
      try {
        const { data } = await apiPost('api/categories', newCategory);
        setCategories(prevCategories => [...prevCategories, data.category]);
        handleClose();
      } catch (error) {
        console.log(error.message);
      }
      return;
    }

    try {
      const response = initialData
        ? await apiPut(`api/product/products/${initialData._id}`, newProduct)
        : await apiPost('api/product/createproduct', newProduct);

      if (response.status === 200) {
        setSnackbarMessage('Product saved successfully');
        setSnackbarSeverity('success');
        setOpen(false);
        dataHandler();
      }
    } catch (error) {
      setSnackbarMessage('Failed to save product');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      {initialData ? (
        <IconButton onClick={handleClickOpen}>
          <EditNoteOutlined />
        </IconButton>
      ) : user && (user.role === 'admin' || user.role === 'vendor') ? (
        !addCategory ? (
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            New Product
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Category
          </Button>
        )
      ) : null}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{initialData ? 'Update Product' : addCategory ? 'Add Category' : 'New Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={addCategory ? 'Add category' : 'Product Name'}
                variant="outlined"
                required
                value={productName}
                sx={{ marginTop: 1 }}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>

            {!addCategory && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Images (comma-separated)"
                    variant="outlined"
                    required
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    variant="outlined"
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    variant="outlined"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Technologies</InputLabel>
                    <Select
                      multiple
                      value={technologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {[
                        // Frontend Technologies
                        'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
                        // Backend Technologies
                        'Node.js', 'Express', 'NestJS',
                        // Database Technologies
                        'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase',
                        // Language/TypeScript
                        'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
                        // State Management
                        'Redux', 'Zustand', 'Recoil',
                        // Cloud and DevOps
                        'AWS', 'Azure', 'Google Cloud', 'Vercel', 'Netlify', 'Docker', 'Kubernetes',
                        // Python & Frameworks
                        'Python', 'Django', 'Flask',
                        // Other Technologies
                        'GraphQL', 'REST API', 'Sass', 'Less', 'Git', 'GitHub', 'GitLab', 'Webpack', 'Vite',
                        // Testing
                        'Jest', 'Cypress', 'Playwright',
                        // ORM
                        'Prisma', 'Sequelize', 'Mongoose'
                      ].map((tech) => (
                        <MenuItem key={tech} value={tech}>
                          <Checkbox checked={technologies.indexOf(tech) > -1} />
                          {tech}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
          }}
        />
      </Snackbar>
    </div>
  );
};

export default ProductForm;
