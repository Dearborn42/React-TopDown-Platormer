import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Edit(){
    const [form, setForm] = useState({name: "", age: "", course: ""});
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    async function fetchFunction(e){
        e.preventDefault();
        const update = {...form}
        const getData = await fetch("http://localhost:5000/docs", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        })
        //const postData = await fetch("http://localhost:5000/docs", {
        //    method: "POST",
        //    headers: { "Content-Type": "application/json" },
        //    credentials: 'include',
        //    body: JSON.stringify(update)
        //})
        //const putData = await fetch("http://localhost:5000/docs", {
        //    method: "PUT",
        //    headers: { "Content-Type": "application/json" },
        //    credentials: 'include',
        //    body: JSON.stringify(update)
        //})
        updateForm({name: "",age: "",course: "",})
    }
    return(
        <>
        <div className="mx-auto w-25 h-50 d-flex flex-column border border-primary p-3">
            <form onSubmit={fetchFunction} className="mt-2">
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={form.name}
                    placeholder="Enter student name"
                    maxLength="15"
                    onChange={(e) => updateForm({ name: e.target.value })}
                />
                <br />
                <input
                    type="text"
                    className="form-control"
                    id="age"
                    value={form.age}
                    placeholder="Enter student age"
                    onChange={(e) => updateForm({ age: e.target.value })}
                />
                <br />
                <input
                    type="text"
                    className="form-control"
                    id="course"
                    value={form.course}
                    placeholder="Enter student course"
                    onChange={(e) => updateForm({ course: e.target.value })}
                />
                <div className="d-flex justify-content-center w-100 mt-2">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
        </>
    );
}