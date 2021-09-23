function resObjPath(obj, path) {
    try {
        const parts = path.split('.');
        let o = obj;
        for (const part of parts) {
            if (typeof o === 'object' && o !== null && part in o) {
                o = o[part];
            } else {
                return undefined;
            }
        }
        return o;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

module.exports = resObjPath;