// CommentSection.jsx
import React, { useState } from 'react';
import CommentItem from './commentItem';

const CommentSection = ({ 
  blog, 
  comment, 
  setComment, 
  reply, 
  setReply, 
  onCommentSubmit, 
  onReplySubmit,
  likeBlog,
  handleUpdateComment
}) => {
  // Keeps track of the single comment entry target actively accepting replies
  const [activeReplyId, setActiveReplyId] = useState(null);

  // Custom handler that submits data and cleanly hides the sub-reply input box
  const handleReplyWrapper = async (blogId, commentId) => {
    await onReplySubmit(blogId, commentId);
    setActiveReplyId(null); 
  };

  return (
    <div className="w-full h-full flex flex-col items-start gap-5 md:mt-10 mt-5 mb-5">
      <div className="w-[40%] h-auto">
        <h2 className="text-2xl font-semibold mb-5">Comments</h2>
      </div>

      {/* Filter and render parent comments */}
      {blog.comments && blog.comments.length > 0 ? (
        blog.comments.map((item) => (
          item.parent_id == null && (
            <CommentItem
              key={item.id}
              comment={item}
              blogId={blog.id}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              replyText={reply}
              setReplyText={setReply}
              onReplySubmit={handleReplyWrapper}
              likeBlog={likeBlog}
              likeCount={item.like_count}
              isLiked={item.user_reaction}
              onUpdateComment={handleUpdateComment}
            />
          )
        ))
      ) : (
        <p className="text-gray-500 text-sm">No comments yet</p>
      )}

      {/* Base Level Post Box Form */}
      <div className="w-full h-auto mt-5">
        <form 
          className="w-full h-auto flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onCommentSubmit(blog.id);
          }}
        >
          <textarea 
            onChange={(e) => setComment(e.target.value)} 
            value={comment} 
            name="comment" 
            id="comment" 
            rows="5" 
            placeholder="Share your thoughts on this post..."
            className="w-full h-auto border border-gray-200 rounded px-4 py-2 focus:outline-none text-sm md:text-base"
          />
          <button 
            type="submit" 
            className="bg-orange-400 hover:bg-orange-500 text-white font-medium rounded px-6 py-2.5 self-start transition-colors"
          >
            Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
