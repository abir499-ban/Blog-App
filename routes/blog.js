const {Router} = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../model/blog');
const Comment = require('../model/comments');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads/'))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()} - ${file.originalname}`;
      cb(null, filename);
    }
  })

  const upload = multer({ storage: storage });

router.get('/add_blog', (req, res) =>{
    return res.render("addBlog",{
        user: req.user,
    })
});

router.post('/',upload.single('coverImage'), async(req,res)=>{
    const {title,body} = req.body;
    const blog = await Blog.create({
      title:title,
      body:body,
      coverImageUrl:`/uploads/${req.file.filename}`,
      createdBy:req.user._id,
    });
    return res.redirect(`/blog/${blog._id}`);
})

router.get('/:id', async(req,res) =>{
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
  console.log(blog);
  return res.render("blog",{
    user:req.user,
    blog,
    comments,
  });
})

router.post('/comment/:blogId', async(req,res) =>{
  const {content}  = req.body;
  await Comment.create({
    content:content,
    blogId:req.params.blogId,
    createdBy:req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = router;