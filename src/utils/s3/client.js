import Signature from './Signature';
import Policy from './Policy';
import { xAmzDate, dateYMD } from './Date';
import uuidv4 from 'uuid/v4';


class Client {
    static upload(file, config) {
        const fd = new FormData();
        const uuid = uuidv4();
        const fileName = `${uuid}-${file.name}`;
        const key = `${config.albumName}/${fileName}`;
        const url = `https://${config.bucketName}.s3.amazonaws.com/`;
        fd.append('key', key);
        fd.append('acl', 'public-read');
        fd.append('Content-Type', file.type);
        fd.append('x-amz-meta-uuid', '14365123651274');
        fd.append('x-amz-server-side-encryption', 'AES256');
        fd.append('X-Amz-Credential', `${config.accessKeyId}/${dateYMD}/${config.region}/s3/aws4_request`);
        fd.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
        fd.append('X-Amz-Date', xAmzDate);
        fd.append('x-amz-meta-tag', '');
        fd.append('Policy', Policy.getPolicy(config));
        fd.append('X-Amz-Signature', Signature.getSignature(config, dateYMD, Policy.getPolicy(config)));
        fd.append("file", file);
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'post',
                headers: {
                    fd
                },
                body: fd
            }).then(done => {
                if (done.ok && done.status >= 200 && done.status <= 299) {
                    return resolve({
                        bucket: config.bucketName,
                        path: key,
                        fileName: fileName
                        // location: `${url}photos/${file.name}`
                    });
                }
            }).catch(error => {
                return reject(error);
            });
        });
    }
    static delete(fileName, config) {
        const fd = new FormData();
        const url = `https://${config.bucketName}.s3-${config.region}.amazonaws.com/${config.albumName}/${fileName}`;
        fd.append('Date', xAmzDate);
        fd.append('X-Amz-Date', xAmzDate);
        fd.append('Authorization', Signature.getSignature(config, dateYMD, Policy.getPolicy(config)));
        fd.append('Content-Type', 'text/plain');
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'delete',
                headers: {
                    fd
                }
            }).then(response => {
                if (response.ok && response.status >= 200 && response.status <= 299) {
                    return resolve({
                        ok: response.ok,
                        status: response.status,
                        message: 'File Deleted',
                        fileName: fileName
                    });
                }
            }).catch(err => reject(err));
        });
    }
}
export default Client;
