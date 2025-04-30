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
      setProductName(initialData.productName || '');
      setDescription(initialData.description || '');
      setImages(initialData.images?.join(', ') || '');
      setPrice(initialData.price || 0);
      setTechnologies(initialData.technologies || []);
      setDiscount(initialData.discount || 0);
      setReferenceWebsite(initialData.referenceWebsite || '');
      setCategory(initialData?.category?._id || initialData?.category || '');
      setSubCategory(
        typeof initialData?.subcat === 'object'
          ? initialData?.subcat?._id
          : initialData?.subcat || ''
      );
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
    setSubCategory('');
    setSubcatList([{ name: '', description: '' }]);
  };

  const handleSubmit = async () => {
    const missingFields = !addCategory &&
      (!productName || !description || !images || !price || !referenceWebsite || !category);

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
      subcat: subCategory,
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
                    variant="outlined"
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
                      value={technologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {[
  // ── Frontend ──
  'HTML', 'CSS', 'SCSS', 'SASS', 'JavaScript', 'TypeScript',
  'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte',
  'Tailwind CSS', 'Bootstrap', 'Material UI', 'Ant Design',
  'Chakra UI', 'jQuery', 'Lit', 'Stencil', 'Alpine.js',

  // ── Backend ──
  'Node.js', 'Express.js', 'NestJS', 'Koa', 'Hapi',
  'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 
  'Laravel', 'Ruby on Rails', 'Phoenix (Elixir)', 'Go (Gin/Gorilla)', 
  'Fiber (Go)', 'Actix (Rust)', 'Rocket (Rust)',

  // ── Mobile / Cross-platform ──
  'React Native', 'Flutter', 'Ionic', 'Cordova', 'Swift (iOS)',
  'Kotlin (Android)', 'Java (Android)', 'Xamarin',

  // ── Databases ──
  'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Firebase Firestore',
  'Realtime Database', 'Oracle DB', 'SQL Server', 'MariaDB', 'Cassandra',
  'DynamoDB', 'Supabase', 'Neo4j', 'CouchDB', 'PlanetScale', 'SurrealDB',

  // ── DevOps / Infra ──
  'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Nginx', 'Apache',
  'PM2', 'Vercel', 'Netlify', 'Heroku', 'AWS', 'GCP', 'Azure',
  'Railway', 'Render', 'Cloudflare', 'GitHub Actions', 'GitLab CI', 'CircleCI',
  'Jenkins', 'Travis CI',

  // ── APIs & Communication ──
  'GraphQL', 'REST', 'tRPC', 'gRPC', 'Apollo Client', 'URQL',
  'Axios', 'Fetch API', 'WebSockets', 'Socket.io', 'Pusher',
  'Postman', 'Insomnia', 'Swagger', 'OpenAPI',

  // ── Testing / QA ──
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Enzyme', 'Playwright',
  'Vitest', 'Puppeteer', 'Testing Library', 'Karma', 'Supertest',

  // ── Build Tools / Bundlers ──
  'Webpack', 'Vite', 'Parcel', 'Rollup', 'esbuild', 'Babel',

  // ── Linters / Formatters / Tools ──
  'ESLint', 'Prettier', 'Husky', 'Lint-staged', 'Stylelint',

  // ── Version Control & Collaboration ──
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SourceTree',

  // ── Package Managers ──
  'npm', 'Yarn', 'pnpm',

  // ── State Management ──
  'Redux', 'Zustand', 'Jotai', 'Recoil', 'MobX', 'Context API',

  // ── Authentication / Security ──
  'JWT', 'OAuth', 'NextAuth.js', 'Clerk', 'Auth0', 'Firebase Auth',
  'Magic.link', 'bcrypt', 'Passport.js', 'Helmet.js',

  // ── CMS / Headless ──
  'Sanity', 'Strapi', 'Contentful', 'WordPress', 'Ghost', 'DatoCMS', 'Prismic',

  // ── Analytics / Monitoring ──
  'Google Analytics', 'Mixpanel', 'Hotjar', 'Sentry', 'LogRocket', 'PostHog',

  // ── AI / ML / Data Tools ──
  'TensorFlow.js', 'ONNX.js', 'LangChain', 'Pinecone', 'OpenAI API',

  // ── Other / Utilities ──
  'Framer Motion', 'Three.js', 'Chart.js', 'D3.js', 'Day.js', 'Moment.js',
  'Lodash', 'RxJS', 'Immer', 'clsx', 'classnames', 'uuid', 'qs'
].map((tech) => (
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
                      {categories.find((c) => c._id === category)?.subcat?.map((sub) => (
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
