import multer from "multer"

export const config = {
  api: {
    bodyParser: false,
  },
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

var upload = multer({ storage: storage })

export default (req, res) => {
  upload.array("iphoneAdPix", 3)(req, {}, err => {
    // do error handling here
    console.log(req.file) // do something with the files here
  })
  res.status(200).send(req)
}