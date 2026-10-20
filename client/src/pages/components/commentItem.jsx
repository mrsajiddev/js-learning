// CommentItem.jsx
import React from 'react';
import { useState } from 'react';
import { HeartIcon, PenLine, X } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const CommentItem = ({ 
  comment, 
  blogId, 
  activeReplyId, 
  setActiveReplyId, 
  replyText, 
  setReplyText, 
  onReplySubmit,
  likeBlog,
  likeCount,
  onUpdateComment
}) => {
  const isReplying = activeReplyId === comment.id;
  const [editComment, setEditComment] = useState(false);
  const [editCommentText, setEditCommentText] = useState(comment.content);

  return (
    <div className={`w-full h-auto flex flex-col justify-start items-start gap-2 ${
      comment.parent_id ? 'md:ml-10 ml-4 mt-5 border-l border-gray-200 pl-4' : 'border-b border-gray-200 pb-5 mb-5'
    }`}>
      
      {/* User Info Header */}
      <div className="w-full h-auto flex flex-row items-center gap-2">
        <img 
          src={comment.user?.profile_image} 
          alt={comment.user?.user_name} 
          className="w-[40px] h-[40px] rounded-full object-cover" 
        />
        <div className="w-full h-auto flex flex-col">
          <p className="text-black font-semibold text-sm md:text-base">{comment.user?.full_name}</p>
          <p className="text-gray-500 text-xs">
            {dayjs.utc(comment.created_at).local().format('MMMM D, YYYY [at] h:mm A')}
          </p>
        </div>
      </div>

      {/* Comment Body Content */}
      <p className="text-gray-500 text-sm md:text-base whitespace-pre-line">{comment.content}</p>

      {/* Reply Action Toggle & Form */}
      <div className="w-full h-auto flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
            <button 
            className="text-gray-500 hover:text-orange-400 text-sm cursor-pointer font-medium"
            onClick={() => {
                setActiveReplyId(isReplying ? null : comment.id);
                setReplyText(""); // clear input field when toggling boxes
            }}
            >
            {isReplying ? 'Cancel' : 'Reply'}
            </button>
              <span className={`flex items-center ${comment.user_reaction == 1 ? 'text-red-500' : 'text-gray-500'}`}>
                <HeartIcon size={18}  fill={comment.user_reaction == 1 ? 'red' : 'white'}
                  className="inline-block mx-2 cursor-pointer hover:text-red-400"
                  onClick={(e) => {
                    e.preventDefault();
                    likeBlog(null, comment.id, 'comment', comment.user_reaction == 1 ? 0 : 1)
                  }}
                  />
                {comment.like_count}
              </span>
              <span className="flex items-center text-gray-500">
              {comment.user_can_edit === true && (
                <PenLine size={16}
                className="inline-block mx-2 cursor-pointer hover:text-orange-400"
                onClick={(e) => {
                    setEditComment(true);
                    setEditCommentText(comment.content);
                }}
                 />
              )}
            </span>
        </div>

        {editComment && (
          <div className="relative w-full h-auto mt-2">
            <form 
              className="relative w-full h-auto flex flex-col gap-2" 
              onSubmit={(e) => {
                e.preventDefault();
                setEditComment(false);
                onUpdateComment(blogId, comment.id, editCommentText);
                setEditCommentText("");
              }}
            >
              <textarea 
                onChange={(e) => setEditCommentText(e.target.value)} 
                value={editCommentText} 
                name="reply" 
                id={`reply-${comment.id}`}
                rows="3" 
                placeholder="Write your reply..."
                className="w-full h-auto border border-gray-200 rounded px-4 py-2 focus:outline-none text-sm"
              />
              <button 
                type="submit" 
                className="bg-orange-400 hover:bg-orange-500 text-white rounded px-4 py-2 text-sm self-start transition-colors"
              >
                Update
              </button>
              <X className='absolute top-0 right-0 cursor-pointer bg-gray-400 hover:bg-gray-500 text-white rounded-full p-1 text-sm self-start transition-colors' size={20} onClick={() => setEditComment(false)} />
            </form>
          </div>
        )}

        {isReplying && (
          <div className="w-full h-auto mt-2">
            <form 
              className="w-full h-auto flex flex-col gap-2" 
              onSubmit={(e) => {
                e.preventDefault();
                onReplySubmit(blogId, comment.id);
              }}
            >
              <textarea 
                onChange={(e) => setReplyText(e.target.value)} 
                value={replyText} 
                name="reply" 
                id={`reply-${comment.id}`}
                rows="3" 
                placeholder="Write your reply..."
                className="w-full h-auto border border-gray-200 rounded px-4 py-2 focus:outline-none text-sm"
              />
              <button 
                type="submit" 
                className="bg-orange-400 hover:bg-orange-500 text-white rounded px-4 py-2 text-sm self-start transition-colors"
              >
                Reply
              </button>
            </form>
          </div>
        )}
      </div>

      {/* RECURSION ENGINE: Renders child layers down the chain automatically */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="w-full h-auto flex flex-col gap-2">
          {comment.replies.map((childReply) => (
            <CommentItem
              key={childReply.id}
              comment={childReply}
              blogId={blogId}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              replyText={replyText}
              setReplyText={setReplyText}
              onReplySubmit={onReplySubmit}
              likeBlog={likeBlog}
              onUpdateComment={onUpdateComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
