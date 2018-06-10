export class Image {
    constructor(props = {}, index = 0) {
        this.id = props.id;
        this.preview = props.path;
        this.main = props.path;
        this.index = index;

        this.getPreview = this.getPreview.bind(this);
        this.getMain = this.getMain.bind(this);

        this.previewBlob = null;
        this.previewImage = null;
        this.previewImageUrl = '';
        this.previewBlobFetch = false;
        this.mainBlob = null;
        this.mainImage = null;
        this.mainImageUrl = '';
        this.mainBlobFetch = false;
    }

    get Preview() {
        return {
            blob: this.previewBlob,
            image: this.previewImage,
            imageSrc: this.previewImageUrl,
            fetch: this.previewBlobFetch,
            error: this.previewBlob == null && this.previewBlobFetch == false
        }
    } 

    loadPreview(callback) {
        if(this.previewBlob == null) {
            if(this.preview != '') {
                this.previewBlobFetch = true;
                downloadImage(this.preview, blob => {
                    if(blob != null) {
                        this.previewBlob = blob;
                        this.previewImageUrl = URL.createObjectURL(blob)
                        this.previewBlobFetch = false;
                        if(callback)
                            callback(this.Preview)
                    }
                })
            }
        }

        if(callback) {
            callback(this.Preview);
        }
    }

    get Main() {
        if(this.mainBlob == null) {
            if(this.main != '') {
                this.mainBlobFetch = true;
                downloadImage(this.main, blob => {
                    if(blob != null) {
                        this.mainBlob = blob;
                        this.mainImageUrl = URL.createObjectURL(blob)
                        this.mainBlobFetch = false
                    }
                })
            }
        }

        return {
            blob: this.mainBlob,
            image: this.mainImage,
            imageSrc: this.mainImageUrl,
            fetch: this.mainBlobFetch,
            error: this.mainBlob == null && this.mainBlobFetch == false
        }
    }

    getImageQuery(id, {preview = false, size = 1024}) {
        return `http://localhost:50146/api/image/${id}?type=preview`
    }

    getPreview() {
        if(this.preview != null) {
            if(this.preview[0] == 'u')
                return `http://localhost:50146/api/image/${1}?type=preview`;

            return this.preview
        }

        return 'http://localhost:50146/uploads/tmp/scarf-3.jpg';
    }

    getMain() {
        if(this.main != null) {
            if(this.main[0] == 'u')
            return `http://localhost:50146/api/image/${1}?type=preview`;

            return this.main;
        }

        return 'http://localhost:50146/uploads/tmp/scarf-3.jpg';
    }
}