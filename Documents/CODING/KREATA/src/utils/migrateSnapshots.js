const mongoose = require('mongoose');
const Snapshots = require('../models/snapshotsModel'); // Adjust path as needed

const migrateSnapshots = async () => {
  try {
    // Connect to the database
    const uri = process.env.MONGO_URI ||  'mongodb+srv://croxtech:KKcZgOGaF8ELIDIz@clusternac.kvbup.mongodb.net/?retryWrites=true&w=majority&appName=ClusterNac';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('Database connected.');

    // Find documents where snapshotData is not an array
    const documentsToUpdate = await Snapshots.find({ snapshotData: { $type: "object" } });

    if (documentsToUpdate.length === 0) {
      console.log('No documents require migration.');
      return;
    }

    for (const doc of documentsToUpdate) {
      // Wrap snapshotData object into an array
      doc.snapshotData = [doc.snapshotData];
      await doc.save();
      console.log(`Updated document with _id: ${doc._id}`);
    }

    console.log('Migration completed successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error during migration:', error);
    mongoose.connection.close();
  }
};

migrateSnapshots();
