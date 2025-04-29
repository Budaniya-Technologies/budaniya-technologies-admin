import { useEffect, useState } from 'react';
import {
  Dialog, Checkbox, FormControlLabel, DialogActions, DialogContent,
  DialogTitle, Button, TextField, Grid, Snackbar, SnackbarContent,
  MenuItem, Select, InputLabel, FormControl, IconButton
} from '@mui/material';
import { apiGet, apiPost, apiPut } from '../../../api/apiMethods';
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
  const [subCategory, setSubCategory] = useState('');
  const [subcatList, setSubcatList] = useState([{ name: '', description: '' }]);
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
      setSubCategory(initialData?.subcat || '');
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    if (user) {
      setReferenceWebsite(user.referenceWebsite || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await apiGet('api/categories');
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setImages('');
    setPrice(0);
    setTechnologies([]);
    setDiscount(0);
    setReferenceWebsite('');
    setCategory('');
    setSubCategory('');
    setSubcatList([{ name: '', description: '' }]);
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
      subcat: subCategory,
    };

    const newCategory = {
      name: productName,
      description,
      subcat: subcatList,
      referenceWebsite: import.meta.env.VITE_API_REFERENCE_WEBSITE,
    };

    if (addCategory) {
      try {
        const { data } = await apiPost('api/categories', newCategory);
        setCategories((prev) => [...prev, data.category]);
        handleClose();
      } catch (error) {
        console.error('Error creating category:', error.message);
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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <div>
      {initialData ? (
        <IconButton onClick={handleClickOpen}>
          <EditNoteOutlined />
        </IconButton>
      ) : user && (user.role === 'admin' || user.role === 'vendor') ? (
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          {addCategory ? 'Add Category' : 'New Product'}
        </Button>
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
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>

            {addCategory && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
            )}

            {addCategory && subcatList.map((sub, index) => (
              <Grid container spacing={1} key={index} sx={{ mt: 1 }}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label={`Subcategory Name #${index + 1}`}
                    variant="outlined"
                    value={sub.name}
                    onChange={(e) => {
                      const updated = [...subcatList];
                      updated[index].name = e.target.value;
                      setSubcatList(updated);
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={sub.description}
                    onChange={(e) => {
                      const updated = [...subcatList];
                      updated[index].description = e.target.value;
                      setSubcatList(updated);
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button color="error" onClick={() => {
                    const updated = subcatList.filter((_, i) => i !== index);
                    setSubcatList(updated);
                  }}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            ))}

            {addCategory && (
              <Grid item xs={12}>
                <Button variant="outlined" onClick={() => setSubcatList([...subcatList, { name: '', description: '' }])}>
                  Add Subcategory
                </Button>
              </Grid>
            )}

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
  // Frontend
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'Material UI',

  // Backend
  'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Ruby on Rails', 'Spring Boot', 'Laravel', 'PHP', 'ASP.NET Core', 'Koa.js', 'Go', 'Rust',

  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'MariaDB', 'Firebase Realtime DB', 'Firestore', 'Oracle DB', 'Microsoft SQL Server', 'Redis', 'Cassandra', 'DynamoDB',

  // Mobile Development
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java (Android)', 'Xamarin', 'Ionic', 'NativeScript',

  // Cloud Platforms
  'AWS', 'Azure', 'Google Cloud Platform (GCP)', 'Netlify', 'Vercel', 'Heroku', 'DigitalOcean',

  // DevOps & Containerization
  'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'CircleCI', 'Travis CI',

  // APIs & Communication
  'GraphQL', 'REST API', 'gRPC', 'WebSockets', 'Apollo Server', 'Apollo Client',

  // Testing
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright', 'Puppeteer', 'Enzyme', 'React Testing Library',

  // Auth & Security
  'OAuth', 'JWT', 'Firebase Auth', 'Auth0', 'Passport.js', 'Okta',

  // CI/CD & Version Control
  'Git', 'GitHub', 'GitLab', 'Bitbucket',

  // Build Tools & Bundlers
  'Webpack', 'Vite', 'Babel', 'Parcel', 'Rollup',

  // Linters & Formatters
  'ESLint', 'Prettier',

  // Misc Tools & Platforms
  'Nginx', 'Apache', 'Figma', 'Postman', 'Swagger', 'Socket.io'
]
.map((tech) => (
                        <MenuItem key={tech} value={tech}>
                          <Checkbox checked={technologies.includes(tech)} />
                          {tech}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubCategory('');
                      }}
                    >
                      {categories?.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sub Category</InputLabel>
                    <Select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      {categories?.find((c) => c._id === category)?.subcat?.map((sub) => (
                        <MenuItem key={sub._id} value={sub._id}>
                          {sub.name}
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
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <SnackbarContent
          message={snackbarMessage}
          style={{ backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }}
        />
      </Snackbar>
    </div>
  );
};

export default ProductForm;
