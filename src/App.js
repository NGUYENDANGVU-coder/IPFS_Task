import { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";

const projectId = "2PJoEGTrNQs0mqOP2j6IHR1CHms";
const projectSecret = "14b625a29be5f00e65ab1fdc49c2f43b";
const authorization = "Basic " + window.btoa(projectId + ":" + projectSecret);
function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const form = e.target;
    const files = form[0].files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    const file = files[0];
    try {
      // upload files
      setLoading(true);
      const result = await ipfs.add(file);
      setImages([
        ...images,
        {
          cid: result.cid,
          path: result.path,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    form.reset();
  };
  console.log(images);
  return (
    <div className="App overflow-hidden">
      {ipfs && (
        <div className="flex items-center justify-center flex-col">
          <h3 className="mt-5 text-lg font-semibold">Upload file to IPFS</h3>
          <form className="mt-16" onSubmit={onSubmitHandler}>
            <input type="file" name="file" />
            <button type="submit" className="bg-black w-32 h-8 text-white">
              Upload file
            </button>
          </form>
        </div>
      )}
      {loading ? (
        <>Loading...</>
      ) : (
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className=" mt-10 px-4 ">
              <img
                src={"https://skywalker.infura-ipfs.io/ipfs/" + image.path}
                alt="img_IPFS"
                className="object-center object-cover w-[320px] h-[360px]"
              />
              <a
                href={"https://skywalker.infura-ipfs.io/ipfs/" + image.cid}
                className="underline text-blue-300 mt-4 block "
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                Link IPFS address{" "}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
