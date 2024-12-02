import React from 'react';

const PostCard = ({ post, index }) => {
  return (
    <div className="post-card">
      <h3>Post #{index}</h3>
      <p><strong>ID:</strong> {post.id}</p>
      <p><strong>Title:</strong> {post.title}</p>
    </div>
  );
};

export default PostCard;
