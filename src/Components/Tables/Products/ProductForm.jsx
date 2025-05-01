import { useEffect, useState } from 'react';
import {
  Dialog, Checkbox, FormControlLabel, DialogActions, DialogContent,
  DialogTitle, Button, TextField, Grid, Snackbar, SnackbarContent,
  MenuItem, Select, InputLabel, FormControl, IconButton
} from '@mui/material';
import { apiPost, apiPut } from '../../../api/apiMethods';
import { EditNoteOutlined } from '@mui/icons-material';
import { useUser } from '../../../Context/UserContext';


const technologyOptions = [
  // Programming Languages
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Ruby', 'PHP', 'Rust', 'Swift', 'Kotlin', 'Dart',

  // Frontend Frameworks/Libraries
  'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte', 'Alpine.js', 'Preact', 'Gatsby', 'SolidJS',

  // Styling
  'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'Bulma', 'Sass', 'SCSS', 'Less', 'Styled Components', 'Emotion',

  // Backend Frameworks
  'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'Ruby on Rails', 'Laravel', 'Spring Boot', 'ASP.NET', 'Koa', 'Hapi',

  // Mobile Development
  'React Native', 'Flutter', 'SwiftUI', 'Xamarin', 'Kotlin Multiplatform', 'Ionic', 'NativeScript',

  // Databases
  'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Oracle', 'Microsoft SQL Server', 'MariaDB', 'Firebase Firestore', 'Cassandra', 'Neo4j', 'Supabase', 'DynamoDB', 'FaunaDB',

  // Cloud Platforms
  'AWS', 'Google Cloud', 'Microsoft Azure', 'Heroku', 'Vercel', 'Netlify', 'DigitalOcean', 'Firebase', 'Render', 'Railway',

  // DevOps & CI/CD
  'Docker', 'Kubernetes', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'Travis CI', 'Ansible', 'Terraform', 'Pulumi',

  // Authentication & Security
  'JWT', 'OAuth2', 'Firebase Auth', 'Auth0', 'Clerk', 'SuperTokens', 'Passport.js', 'Bcrypt', 'Keycloak',

  // APIs & Integration
  'REST API', 'GraphQL', 'gRPC', 'tRPC', 'WebSockets', 'Apollo Client', 'Axios', 'Fetch API', 'Postman', 'Insomnia',

  // CMS & Headless CMS
  'WordPress', 'Strapi', 'Sanity', 'Contentful', 'Ghost', 'Prismic', 'DatoCMS', 'Directus', 'KeystoneJS',

  // State Management
  'Redux', 'MobX', 'Recoil', 'Zustand', 'Jotai', 'Context API', 'XState', 'React Query', 'SWR',

  // Testing Libraries & Tools
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright', 'Puppeteer', 'Vitest', 'Testing Library', 'Postman',

  // AI/ML Tools & Frameworks
  'TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'OpenCV', 'Pandas', 'NumPy', 'Matplotlib', 'LangChain', 'Transformers', 'HuggingFace', 'OpenAI API',

  // Blockchain
  'Solidity', 'Hardhat', 'Truffle', 'Web3.js', 'Ethers.js', 'IPFS', 'Moralis', 'Alchemy', 'Infura', 'Metamask',

  // Build Tools & Bundlers
  'Webpack', 'Vite', 'Parcel', 'Rollup', 'Babel', 'ESBuild',

  // Linters, Formatters & Utilities
  'ESLint', 'Prettier', 'Husky', 'Lint-staged', 'EditorConfig',

  // Version Control & Project Tools
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'npm', 'yarn', 'pnpm', 'TurboRepo', 'Nx', 'Lerna',

  // Animation & Design
  'Framer Motion', 'GSAP', 'Three.js', 'Lottie', 'Figma', 'Adobe XD', 'Canva',

  // Others
  'OpenAI', 'Firebase Realtime DB', 'Stripe', 'PayPal', 'Twilio', 'SendGrid', 'Nodemailer', 'Socket.IO', 'Cloudinary', 'ImageKit',
];


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
  const [subcat, setSubcat] = useState('');
  const [subcatList, setSubcatList] = useState([{ name: '', description: '' }]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [overview, setOverview] = useState('');
  const [support, setSupport] = useState('');
  const [reviews, setReviews] = useState('');
  const [specification, setSpecification] = useState('');
  const { user, categories, setCategories } = useUser();

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || '');
      setDescription(initialData.description || '');
      setImages(initialData.images?.join(', ') || '');
      setPrice(initialData.price || 0);
      setTechnologies(Array.isArray(initialData.technologies) ? initialData.technologies : []);
      setDiscount(initialData.discount || 0);
      setReferenceWebsite(initialData.referenceWebsite || '');
      setCategory(initialData.category?._id || initialData.category || '');
      setSubcat(initialData.subcategory?._id || initialData.subcategory || '');
      setOverview(initialData.overview || '');
      setSupport(initialData.support || '');
      setReviews(initialData.reviews || '');
      setSpecification(initialData.specification || '');
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    if (user?.referenceWebsite) {
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
    setSubcat('');
    setSubcatList([{ name: '', description: '' }]);
    setOverview('');
    setSupport('');
    setReviews('');
    setSpecification('');
  };

  const handleSubmit = async () => {
    const missingFields = !addCategory &&
      (!productName || !description || !images || !price || !referenceWebsite || !category || !subcat);

    if ((missingFields) || (addCategory && !productName)) {
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
      subcat,
      overview,
      support,
      reviews,
      specification,
    };

    const newCategory = {
      name: productName,
      description,
      subcat: subcatList,
      referenceWebsite: import.meta.env.VITE_API_REFERENCE_WEBSITE,
    };

    try {
      if (addCategory) {
        const { data } = await apiPost('api/categories', newCategory);
        setCategories((prev) => [...prev, data.category]);
        setSnackbarMessage('Category created successfully');
        resetForm();
      } else {
        const response = initialData
          ? await apiPut(`api/product/products/${initialData._id}`, newProduct)
          : await apiPost('api/product/createproduct', newProduct);

        if (response.status === 200) {
          setSnackbarMessage('Product saved successfully');
          dataHandler();
        }
      }

      setSnackbarSeverity('success');
      resetForm();
      handleClose();
    } catch (error) {
      setSnackbarMessage('Failed to save data');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const selectedTechnologies = Array.isArray(technologies) ? technologies : [];

  return (
    <div>
      {initialData ? (
        <IconButton onClick={handleClickOpen}>
          <EditNoteOutlined />
        </IconButton>
      ) : user && ['admin', 'vendor'].includes(user.role) ? (
        <Button variant="contained" onClick={handleClickOpen}>
          {addCategory ? 'Add Category' : 'New Product'}
        </Button>
      ) : null}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{initialData ? 'Update Product' : addCategory ? 'Add Category' : 'New Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={addCategory ? 'Category Name' : 'Product Name'}
                variant="outlined"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>

            {addCategory ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Category Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                {subcatList.map((sub, index) => (
                  <Grid container spacing={1} key={index} sx={{ mt: 1 }}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label={`Subcategory Name #${index + 1}`}
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
                        setSubcatList(subcatList.filter((_, i) => i !== index));
                      }}>
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={() => setSubcatList([...subcatList, { name: '', description: '' }])}>
                    Add Subcategory
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Images (comma-separated)"
                    required
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price"
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
                      value={selectedTechnologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}
                    >
                      {technologyOptions.map((tech) => (
                        <MenuItem key={tech} value={tech}>
                          <Checkbox checked={selectedTechnologies.includes(tech)} />
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
                        setSubcat('');
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
                      value={subcat}
                      onChange={(e) => setSubcat(e.target.value)}
                    >
                      {categories.find((c) => c._id === category)?.subcat?.map((sub) => (
                        <MenuItem key={sub._id} value={sub._id}>
                          {sub.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Overview"
                    multiline
                    rows={3}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Support"
                    multiline
                    rows={2}
                    value={support}
                    onChange={(e) => setSupport(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reviews"
                    multiline
                    rows={2}
                    value={reviews}
                    onChange={(e) => setReviews(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specification"
                    multiline
                    rows={2}
                    value={specification}
                    onChange={(e) => setSpecification(e.target.value)}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
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
