const { validationResult } = require("express-validator");
const Evaluation = require("../models/Evaluation");

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const evaluation = await Evaluation.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Evaluation created", evaluation });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };

    const [evaluations, total] = await Promise.all([
      Evaluation.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Evaluation.countDocuments(filter),
    ]);

    res.json({
      evaluations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    if (
      req.user.role !== "admin" &&
      evaluation.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ evaluation });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    if (
      req.user.role !== "admin" &&
      evaluation.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updated = await Evaluation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    res.json({ message: "Evaluation updated", evaluation: updated });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    if (
      req.user.role !== "admin" &&
      evaluation.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    await evaluation.deleteOne();
    res.json({ message: "Evaluation deleted" });
  } catch (err) {
    next(err);
  }
};
