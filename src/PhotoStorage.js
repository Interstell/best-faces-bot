const MEMBERS = require('../dataset/best-flickr-members.json');
const PHOTOS = require('../dataset/best-flickr-photos.json');

class PhotoStorage {
  constructor() {
    this.members = MEMBERS;
    this.photos = PHOTOS;
  }

  getMemberByTelegram(telegram) {
    return this.members.find(
      (m) =>
        // member may have no info (alumni / inactive)
        m.info &&
        // comparing trimmed and lower-cased telegram nicknames without @ signs
        m.info.telegram.replace(/@/, '').trim().toLowerCase() ===
          telegram.replace(/@/, '').trim().toLowerCase(),
    );
  }

  getPhotoById(photoId) {
    return this.photos.find((f) => f.id === photoId);
  }

  getFacesByTelegram(telegram) {
    const member = this.getMemberByTelegram(telegram);
    return member ? member.faces : [];
  }

  isPresentOnPhotos(telegram) {
    return !!this.getMemberByTelegram(telegram);
  }
}

const photoStorage = new PhotoStorage();

module.exports = photoStorage;
