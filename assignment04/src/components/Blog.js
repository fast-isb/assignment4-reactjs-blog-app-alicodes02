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
import Rating from '@mui/material/Rating';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';

export default function Blog(props) {

  const [isFollowing, setIsFollowing] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    title: props.title,
    content: props.content,
  });
  const [commentData, setCommentData] = useState({
    comment: "",
  });
  const [rating, setRating] = useState(0);

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

  const handleCommentInputChange = (e) => {
    setCommentData({
      ...commentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFollow = async () => {
    try {
        const response = await axios.post(`http://localhost:3000/follow/${props.ownerId}`, {}, {
        headers: {
          Authorization: `Bearer ${props.usertoken}`,
        },
      });

      alert('User followed successfully:');

      setIsFollowing(true);

    } catch (error) {
      console.error('Error following user:', error);
      alert('You are already following this user!');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/delete-blog/${props.id}`, {
        headers: {
          Authorization: `Bearer ${props.usertoken}`,
        },
      });

      console.log('Blog deleted successfully:', response.data);

      if (props.onDelete) {
        props.onDelete();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Owner Post Owner can delete the post');
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

      if (props.onEdit) {
        props.onEdit();
      }

      handleEditClose();
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Error updating blog post');
    }
  };

  const handleEditIconClick = () => {
    handleEditOpen();
  };

  const handleAddComment = async () => {
    try {
      const newComment = {
        comment: commentData.comment,
      };

      const response = await axios.post(`http://localhost:3000/comment-blog/${props.id}`, newComment, {
        headers: {
          Authorization: `Bearer ${props.usertoken}`,
        },
      });

      console.log('Comment added successfully:', response.data);

      if(props.onEdit) {
        props.onEdit();
      }
      setCommentData({
        comment: "",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment');
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleAddRating = async () => {
    try {
      const newRating = {
        rating,
      };

      const response = await axios.post(`http://localhost:3000/rate-blog/${props.id}`, newRating, {
        headers: {
          Authorization: `Bearer ${props.usertoken}`,
        },
      });

      console.log('Rating added successfully:', response.data);
      //alert('Rating added successfully');
      if (props.onEdit) {
        props.onEdit();
      }
    } catch (error) {
      console.error('Error adding rating:', error);
      alert('Error adding rating');
    }
  };

  return (
    <div className="card">

      <IconButton
        style={{ position: 'absolute', top: 5, right: 5 }}
        color="primary"
      >
        {isFollowing ? <CheckIcon color='success'/> : <PersonAddIcon onClick={handleFollow} />}
      </IconButton>

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

      {/* Display comments */}
      <div>
        <h4>Comments</h4>
        <ul>
          {props.comments.map((comment) => (
            <li key={comment._id}>{comment.comment}</li>
          ))}
        </ul>
        {/* Comment input */}
        <TextField
          label="Comment"
          name="comment"
          value={commentData.comment}
          onChange={handleCommentInputChange}
          fullWidth
        />
        <Button onClick={handleAddComment} color="primary">
          Add Comment
        </Button>
      </div>

      {/* Display rating */}
      <div>
        <h4>Rating</h4>
        <Rating
          name={`rating-${props.id}`}
          value={rating}
          onChange={(event, newValue) => handleRatingChange(newValue)}
        />
        <IconButton onClick={handleAddRating} color="primary">
          <ThumbUpIcon />
          <span>{props.ratings.length}</span>
        </IconButton>
      </div>
    </div>
  );
}
