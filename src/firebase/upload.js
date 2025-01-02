export default function upLoad(file) {
    return new Promise((resolve) => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
    
            reader.onload = () => {
              const base64String = reader.result;
              resolve(base64String)
            };
        } else {
            resolve(undefined)
        }
    })
}
