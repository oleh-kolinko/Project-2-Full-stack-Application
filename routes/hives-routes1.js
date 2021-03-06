const express = require('express');

const Hive = require('../models/hive-model.js');

const router = express.Router();


router.get('/hives', (req, res, next) => {
  Hive.find((err, hives) => {
    if (err) {
      next(err);
      return;
    }

      // display views/hives/index.ejs
    res.render('hives/hive-index', {
      hives: hives
    });
  });
});

router.get('/hives/new', (req, res, next) => {
    // display views/hives/new.ejs
  res.render(('hives/new-view'), {
    errorMessage: ''
  });
});

router.post('/hives', (req, res, next) => {
  const hiveInfo = {
    name: req.body.name,
    price: req.body.dateCreated,
    description: req.body.comment,
    // imageUrl: req.body.imageUrl,
  };

  const theHive = new Hive(hiveInfo);

  theHive.save((err) => {
    if (err) {
      res.render('hives/new', {
        errorMessage: 'Oh no! Validation Failzsed!',
        errors: theHive.errors
      });
      return;
    }

      // redirect to http://localhost:3000/hives
      //                                  ---------
      //                                       |
      //              --------------------------
      //              |
    res.redirect('/hives');
  });
});

// res.render('hives/show', {
//   hive: hiveDoc
// });

router.get('/hives/:id/edit', (req, res, next) => {
  const hiveId = req.params.id;

  Hive.findById(hiveId, (err, hiveDoc) => {
    if (err) { return next(err); }
    res.render('hives/edit', {
      hive: hiveDoc
    });
  });
});


router.post('/hives/:id', (req, res, next) => {
  const hiveId = req.params.id;
  const hiveUpdates = {
    name: req.body.name,
    price: req.body.dateCreated,
    description: req.body.comment,
    // imageUrl: req.body.imageUrl,
};
  // db.hives.updateOne({ _id: hive }, { $set: hiveUpdates })
  Hive.findByIdAndUpdate(hiveId, hiveUpdates, (err, hive) => {
    if (err){
      next(err);
      return;
    }
      res.redirect('/hives');
    });
  });

  router.post('/hives/:id/delete', (req, res, next) => {
    const hiveId = req.params.id;

    console.log(hiveId);

    // db.hives.deleteOne({_id: hiveId })
    Hive.findByIdAndRemove(hiveId, (err, hive) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/hives');
    });
  });

router.get('/hives/:id', (req, res, next) => {
  let hiveId = req.params.id;

  Hive.findById(hiveId, (err, hiveDoc) => {
    if (err) {
      next(err);
      return;
    }
    res.render('hives/show', {
      hive: hiveDoc
    });
  });
});

module.exports = router;
