import React, { useState } from 'react';
import './Blog.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Blog(props) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    title: props.title,
    content: props.content,
  });

  const handleEditOpen = () => {
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async () => {
    try {
      // Make an API request to delete the blog
      const response = await axios.delete(`http://localhost:3000/delete-blog/${props.id}`, {
        headers: {
          Authorization: `Bearer ${props.usertoken}`,
        },
      });

      console.log('Blog deleted successfully:', response.data);

      // Call a function to update the list of blogs in the parent component
      if (props.onDelete) {
        props.onDelete();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Owner Post Owner can delete the the Post');
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updatedBlog = {
        title: editData.title,
        content: editData.content,
      };

      const response = await axios.put(`http://localhost:3000/update-blog/${props.id}`, updatedBlog, {
        headers: {
          Authorization: `Bearer ${props.usertoken}`,
        },
      });

      console.log('Blog updated successfully:', response.data);

      // Call a function to update the list of blogs in the parent component
      if (props.onEdit) {
        props.onEdit();
      }

      // Close the edit dialog
      handleEditClose();
    } catch (error) {
      console.error('Error updating blog post:', error);
      
      alert('Error updating blog post');
    }
  };

  const handleEditIconClick = () => {
    handleEditOpen();
  };

  return (
    <div className="card">
      <div className="card__owner">
        <AccountCircleIcon fontSize="small" />
        <span>{props.ownerName}</span>
      </div>
      <h3 className="card__title">{props.title}</h3>
      <p className="card__content">{props.content}</p>
      <div className="card__arrow">
        <IconButton color="error" aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton color="primary" aria-label="edit" onClick={handleEditIconClick}>
          <EditIcon />
        </IconButton>
      </div>

      {/* Edit Blog Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={editData.title}
            onChange={handleEditInputChange}
            fullWidth
          />
          <TextField
            label="Content"
            name="content"
            value={editData.content}
            onChange={handleEditInputChange}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Update Blog
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
