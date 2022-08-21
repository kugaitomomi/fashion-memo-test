import axios from "axios";
import { useEffect, useState } from "react";

function Upload() {

  const [pic, setPic] = useState();
  const [allPics, setAllPics] = useState([]);
  const [ category, setCategory ] = useState();
  const [ note, setNote ] = useState();
  useEffect(() => {
    getAllInfo();
  },[allPics]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    //空のオブジェクトを作成。
    const formData = new FormData();
    //useStateで取得しているサーバーに格納されている情報
    console.log(pic);
    //情報を送るために配列にしている。
    formData.append("pic", pic);
    formData.append("category", category);
    formData.append("note", note);
    await axios.post("http://localhost:5000/addPicture", formData).then(getAllInfo()).catch((error) => console.log(error));
  }

    const handleChange = (e) => {
    setPic(e.target.files[0]);
    console.log(e.target.files[0]);
  }

  const getAllInfo = async () => {
    await axios.get('http://localhost:5000/pictures').then(res => {
      setAllPics(res.data);
      console.log(allPics);
    }).catch((error) => {
      console.log(error.messeage);
    })
  }

  const handleDelete = async (name) => {
    await axios
      .delete("http://localhost:5000/delete", {
        //bodyに値をセットする場合は、第2引数にdataというキー名でセットする。
        data: { name: name },
      })
      .then(getAllInfo())
      .catch((error) => console.log(error.message));
  };

  const selectChange = (e) => {
    setCategory(e.target.value);
  }

  const insertChange = (e) => {
    setNote(e.target.value);
  }
  
return (
  <>
  {/* JavaScriptのonsubmitとは、送信ボタンが押された時に起動するイベントです。 onClickと混同しない！ */}
    <form onSubmit={handleSubmit}>
      <input type="file" className="input" onChange={handleChange} />
      <select name="example" value={category} onChange={selectChange}>
      <option value="Daily">Daily</option>
      <option value="Special">Special</option>
      <option value="Date">Date</option>
      <option value="Home">Home</option>
      <option value="メルカリ">メルカリ</option>
      <option value="ラクマ">ラクマ</option>
      </select>
      <input type="text" value={note} onChange={insertChange} />
      <button className="submit" >upload</button>
    </form>
    <div className="imgsContainer">
      {allPics && allPics.map((pic, index) => {
        return <div className="imgItem" key={index}><img src={pic.url} alt={pic.name} width="50%" /><p>{pic.category}</p><p>{pic.note}</p><button className="imgButton" onClick={() => handleDelete(pic.name)}>Delete</button></div>
        //onClickで「関数名()」だとクリックしていなくても、関数が実行されてしまうので削除系の関数の場合は、値が削除されてしまいデータがなくなってしまう。なので、無名関数を挟むことで、「クリックされた時」というタイミングで関数実行ができるようになる。
      })}
      
    </div>
  </>
);
};

export default Upload;
