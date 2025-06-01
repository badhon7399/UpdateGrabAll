const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Banner title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    required: false,
    maxlength: [200, 'Banner subtitle cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Banner description cannot exceed 500 characters']
  },
  image: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  link: {
    type: String,
    required: false,
    default: '/products'
  },
  showButton: {
    type: Boolean,
    default: true
  },
  linkType: {
    type: String,
    enum: ['category', 'product', 'collection', 'external'],
    default: 'category'
  },
  buttonText: {
    type: String,
    required: false,
    default: 'Shop Now'
  },
  active: {
    type: Boolean,
    default: true
  },
  position: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: function() {
      // Default end date is 30 days from now
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field
bannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if banner is currently active based on dates
bannerSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.active && now >= this.startDate && now <= this.endDate;
};

module.exports = mongoose.model('Banner', bannerSchema);
