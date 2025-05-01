// import { useEffect, useState } from 'react';
// import { Dialog, Checkbox, FormControlLabel, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Snackbar, SnackbarContent, Typography, IconButton } from '@mui/material';
// import { apiPost, apiPut } from '../../../api/apiMethods'; // Ensure you have apiPost setup
// import { EditNoteOutlined } from '@mui/icons-material';

// const CategoryForm = ({ dataHandler, initialData }) => {
//     const [open, setOpen] = useState(false);
//     const [name, setname] = useState('');
//     const [description, setDescription] = useState('');
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success | error

//     useEffect(() => {
//         if (initialData) {
//             setname(initialData.name || '');
//             setDescription(initialData.description || '');
//         } else {
//             setname('');
//             setDescription('');
//         }
//     }, [initialData]);

//     const handleSubmit = async () => {
//         if (!name) {
//             setSnackbarMessage('Please fill all required fields');
//             setSnackbarSeverity('error');
//             setSnackbarOpen(true);
//             return;
//         }
//         const newWebsite = {
//             name,
//             description,
            
//         };
//         try {

//             const response = initialData ? await apiPut(`api/categories/${initialData._id}`, newWebsite) : await apiPost('api/categories', newWebsite);
//             if (response.status === 200) {
//                 setSnackbarMessage('Request successfully');
//                 setSnackbarSeverity('success');
//                 setOpen(false);
//                 dataHandler();
//             }
//         } catch (error) {
//             setSnackbarMessage('Request failed');
//             setSnackbarSeverity('error');
//         }
//         setSnackbarOpen(true);
//     };

//     const handleClickOpen = () => {
//         setOpen(true);
//     };
//     const handleClose = () => {
//         setOpen(false);
//     };
//     const handleSnackbarClose = () => {
//         setSnackbarOpen(false);
//     };

//     return (
//         <div>
//             {initialData ? <IconButton onClick={handleClickOpen}><EditNoteOutlined /></IconButton> :
//                 <Button variant="contained" color="primary" onClick={handleClickOpen}>
//                     New Category
//                 </Button>}

//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle paddingBottom={2} fontSize={22}>{initialData ? "Update" : "New"} Category</DialogTitle>
//                 <DialogContent>
//                     <Grid container spacing={3} paddingTop={3}>
//                         <Grid item xs={12}>
//                             <TextField
//                                 fullWidth
//                                 label="Name"
//                                 variant="outlined"
//                                 required
//                                 value={name}
//                                 onChange={(e) => setname(e.target.value)}
//                                 className="mb-4"
//                                 error={!name && open} // Show error if input is empty when dialog is open
//                                 helperText={!name && open ? 'Name is required' : ''}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 fullWidth
//                                 label="Description"
//                                 variant="outlined"
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                                 className="mb-4"
//                             />
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">Cancel</Button>
//                     <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
//                 </DialogActions>
//             </Dialog>

//             <Snackbar
//                 open={snackbarOpen}
//                 autoHideDuration={2000}
//                 onClose={handleSnackbarClose}
//             >
//                 <SnackbarContent
//                     message={snackbarMessage}
//                     style={{
//                         backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
//                     }}
//                 />
//             </Snackbar>
//         </div>
//     );
// };

// export default CategoryForm;





// import { useState, useEffect } from 'react';
// import { Typography,Dialog, Button, TextField, Grid, DialogActions, DialogContent, DialogTitle, Snackbar, SnackbarContent, IconButton } from '@mui/material';
// import { EditNoteOutlined } from '@mui/icons-material';
// import { apiPost } from '../../../api/apiMethods';

// const CategoryForm = ({ dataHandler, initialData }) => {
//     const [open, setOpen] = useState(false);
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [subcategories, setSubcategories] = useState([{ name: '', description: '' }]); // Initial empty subcategory
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//     useEffect(() => {
//         if (initialData) {
//             setName(initialData.name || '');
//             setDescription(initialData.description || '');
//             setSubcategories(initialData.subcat || [{ name: '', description: '' }]);
//         }
//     }, [initialData]);

//     const handleSubcategoryChange = (index, field, value) => {
//         const updatedSubcategories = [...subcategories];
//         updatedSubcategories[index][field] = value;
//         setSubcategories(updatedSubcategories);
//     };

//     const handleAddSubcategory = () => {
//         setSubcategories([...subcategories, { name: '', description: '' }]);
//     };

//     const handleRemoveSubcategory = (index) => {
//         const updatedSubcategories = subcategories.filter((_, i) => i !== index);
//         setSubcategories(updatedSubcategories);
//     };

//     const handleSubmit = async () => {
//         if (!name) {
//             setSnackbarMessage('Please fill all required fields');
//             setSnackbarSeverity('error');
//             setSnackbarOpen(true);
//             return;
//         }

//         const categoryData = { name, description, subcat: subcategories };
        
//         try {
//             const response = initialData
//                 ? await apiPost(`api/categories/${initialData._id}`, categoryData)
//                 : await apiPost('api/categories', categoryData);

//             if (response.status === 200) {
//                 setSnackbarMessage('Request successful');
//                 setSnackbarSeverity('success');
//                 setOpen(false);
//                 dataHandler();
//             }
//         } catch (error) {
//             setSnackbarMessage('Request failed');
//             setSnackbarSeverity('error');
//             setSnackbarOpen(true);
//         }
//     };

//     const handleClickOpen = () => setOpen(true);
//     const handleClose = () => setOpen(false);
//     const handleSnackbarClose = () => setSnackbarOpen(false);

//     return (
//         <div>
//             {initialData ? (
//                 <IconButton onClick={handleClickOpen}><EditNoteOutlined /></IconButton>
//             ) : (
//                 <Button variant="contained" color="primary" onClick={handleClickOpen}>New Category</Button>
//             )}

//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>{initialData ? 'Update Category' : 'New Category'}</DialogTitle>
//                 <DialogContent>
//                     <Grid container spacing={3}>
//                         <Grid item xs={12}>
//                             <TextField
//                                 fullWidth
//                                 label="Name"
//                                 variant="outlined"
//                                 required
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 error={!name && open}
//                                 helperText={!name && open ? 'Name is required' : ''}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 fullWidth
//                                 label="Description"
//                                 variant="outlined"
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Typography variant="h6">Subcategories</Typography>
//                             {subcategories.map((subcat, index) => (
//                                 <div key={index}>
//                                     <TextField
//                                         label="Subcategory Name"
//                                         value={subcat.name}
//                                         onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)}
//                                     />
//                                     <TextField
//                                         label="Subcategory Description"
//                                         value={subcat.description}
//                                         onChange={(e) => handleSubcategoryChange(index, 'description', e.target.value)}
//                                     />
//                                     <Button onClick={() => handleRemoveSubcategory(index)}>- Remove Subcategory</Button>
//                                 </div>
//                             ))}
//                             <Button onClick={handleAddSubcategory}>+ Add Subcategory</Button>
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">Cancel</Button>
//                     <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
//                 </DialogActions>
//             </Dialog>

//             <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
//                 <SnackbarContent message={snackbarMessage} style={{ backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }} />
//             </Snackbar>
//         </div>
//     );
// };

// export default CategoryForm;



import { useEffect, useState } from 'react';
import { Dialog, Checkbox, FormControlLabel, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Snackbar, SnackbarContent, Typography, IconButton } from '@mui/material';
import { apiPost, apiPut } from '../../../api/apiMethods';
import { EditNoteOutlined, AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

const CategoryForm = ({ dataHandler, initialData }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [subcat, setSubcat] = useState([{ name: '', description: '' }]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setSubcat(initialData.subcat && initialData.subcat.length > 0 ? initialData.subcat : [{ name: '', description: '' }]);
        } else {
            setName('');
            setDescription('');
            setSubcat([{ name: '', description: '' }]);
        }
    }, [initialData]);

    const handleSubcatChange = (index, field, value) => {
        const updatedSubcat = [...subcat];
        updatedSubcat[index][field] = value;
        setSubcat(updatedSubcat);
    };

    const addSubcatField = () => {
        setSubcat([...subcat, { name: '', description: '' }]);
    };

    const removeSubcatField = (index) => {
        const updatedSubcat = [...subcat];
        updatedSubcat.splice(index, 1);
        setSubcat(updatedSubcat.length > 0 ? updatedSubcat : [{ name: '', description: '' }]);
    };

    const handleSubmit = async () => {
        if (!name) {
            setSnackbarMessage('Please fill all required fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const newCategory = {
            name,
            description,
            subcat: subcat.filter(item => item.name.trim() !== '') // Only include non-empty subcategories
        };

        try {
            const response = initialData
                ? await apiPut(`api/categories/${initialData._id}`, newCategory)
                : await apiPost('api/categories', newCategory);

            if (response.status === 200) {
                setSnackbarMessage('Request successfully');
                setSnackbarSeverity('success');
                setOpen(false);
                dataHandler();
            }
        } catch (error) {
            console.error(error);
            setSnackbarMessage('Request failed');
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
            ) : (
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    New Category
                </Button>
            )}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle paddingBottom={2} fontSize={22}>
                    {initialData ? 'Update' : 'New'} Category
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} paddingTop={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!name && open}
                                helperText={!name && open ? 'Name is required' : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>

                        {/* Subcategory Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Subcategories
                            </Typography>
                            {subcat.map((item, index) => (
                                <Grid container spacing={2} key={index} alignItems="center" marginBottom={2}>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label="Subcategory Name"
                                            variant="outlined"
                                            value={item.name}
                                            onChange={(e) => handleSubcatChange(index, 'name', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label="Subcategory Description"
                                            variant="outlined"
                                            value={item.description}
                                            onChange={(e) => handleSubcatChange(index, 'description', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton color="error" onClick={() => removeSubcatField(index)}>
                                            <RemoveCircleOutline />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleOutline />}
                                onClick={addSubcatField}
                                style={{ marginTop: '10px' }}
                            >
                                Add Subcategory
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
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

export default CategoryForm;
