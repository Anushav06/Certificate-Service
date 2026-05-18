import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [certificate, setCertificate] = useState({
    certificateName: "",
    issuedTo: "",
    issueDate: "",
    expiryDate: "",
    authority: ""
  });

  const [certificates, setCertificates] = useState([]);

  const [editId, setEditId] = useState(null);

  const [view, setView] = useState("home");

  const [search, setSearch] = useState("");

  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {

    const response = await fetch(
      "http://localhost:9090/certificates"
    );

    const data = await response.json();

    setCertificates(data);

  };

  const handleChange = (e) => {

    setCertificate({
      ...certificate,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const updatedCertificate = {
      ...certificate
    };

    let response;

    if (editId) {

      response = await fetch(
        `http://localhost:9090/certificates/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedCertificate)
        }
      );

    } else {

      response = await fetch(
        "http://localhost:9090/certificates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedCertificate)
        }
      );

    }

    if (response.ok) {

      alert(
        editId
          ? "Certificate Updated!"
          : "Certificate Added!"
      );

      fetchCertificates();

      setCertificate({
        certificateName: "",
        issuedTo: "",
        issueDate: "",
        expiryDate: "",
        authority: ""
      });

      setEditId(null);

      setView("view");

    } else {

      alert("Operation Failed");

    }

  };

  const deleteCertificate = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!confirmDelete) {
      return;
    }

    await fetch(
      `http://localhost:9090/certificates/${id}`,
      {
        method: "DELETE"
      }
    );

    fetchCertificates();

  };

  const editCertificate = (cert) => {

    setCertificate({
      certificateName: cert.certificateName,
      issuedTo: cert.issuedTo,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      authority: cert.authority
    });

    setEditId(cert.certificateId);

  };

  const filteredCertificates =
    certificates.filter((cert) =>
      cert.certificateName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const totalCertificates = certificates.length;

  const expiredCertificates = certificates.filter(
    (cert) =>
      new Date(cert.expiryDate) < new Date()
  ).length;

  const activeCertificates =
    totalCertificates - expiredCertificates;

  return (

    <div className="container">

      {view === "home" && (

        <div className="home-page">

          <h1>
            Welcome to Certificate Management System
          </h1>

          <div className="dashboard">

            <div className="card">
              <h2>{totalCertificates}</h2>
              <p>Total Certificates</p>
            </div>

            <div className="card">
              <h2>{activeCertificates}</h2>
              <p>Active Certificates</p>
            </div>

            <div className="card">
              <h2>{expiredCertificates}</h2>
              <p>Expired Certificates</p>
            </div>

          </div>

          <div className="home-buttons">

            <button onClick={() => setView("add")}>
              Add Certificate
            </button>

            <button onClick={() => setView("view")}>
              View Certificates
            </button>

          </div>

        </div>

      )}

      {view === "add" && (

        <div>

          <button onClick={() => setView("home")}>
            ← Back
          </button>

          <h1>Add Certificate</h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="certificateName"
              placeholder="Certificate Name"
              value={certificate.certificateName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="issuedTo"
              placeholder="Issued To"
              value={certificate.issuedTo}
              onChange={handleChange}
            />

            <input
              type="date"
              name="issueDate"
              value={certificate.issueDate}
              onChange={handleChange}
            />

            <input
              type="date"
              name="expiryDate"
              value={certificate.expiryDate}
              onChange={handleChange}
            />

            <input
              type="text"
              name="authority"
              placeholder="Authority"
              value={certificate.authority}
              onChange={handleChange}
            />

            <button type="submit">

              {editId
                ? "Update Certificate"
                : "Add Certificate"}

            </button>

          </form>

        </div>

      )}

      {view === "view" && (

        <div>

          <button onClick={() => setView("home")}>
            ← Back
          </button>

          <h1>View Certificates</h1>

          <input
            type="text"
            placeholder="Search Certificate..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {filteredCertificates.length === 0 ? (

            <h3>
              No Certificates Added Yet.
              <br /><br />
              Please add a certificate.
            </h3>

          ) : (

            <table border="1" cellPadding="10">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Certificate Name</th>
                  <th>Issued To</th>
                  <th>Authority</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredCertificates.map((cert) => {

                  const today = new Date();

const expiryDate =
  new Date(cert.expiryDate);

const differenceInDays =
  (expiryDate - today) /
  86400000; // Convert milliseconds to days

const isExpired =
  differenceInDays < 0;

const isExpiringSoon =
  differenceInDays >= 0 &&
  differenceInDays <= 15;

                  return (

                    <tr key={cert.certificateId}>

                      <td>{cert.certificateId}</td>

                      <td>
                        {cert.certificateName}
                      </td>

                      <td>{cert.issuedTo}</td>

                      <td>{cert.authority}</td>

                      <td>{cert.expiryDate}</td>

                      <td
  style={{
    color:
      isExpired
        ? "red"
        : isExpiringSoon
        ? "orange"
        : "green",

    fontWeight: "bold"
  }}
>

  {isExpired
    ? "Expired"

    : isExpiringSoon
    ? "Expiring Soon"

    : "Active"}

</td>

                      <td>

                        <select
                          onChange={(e) => {

                            const action =
                              e.target.value;

                            if (action === "view") {

                              setSelectedCertificate(cert);
                              setView("details");

                            }

                            else if (action === "edit") {

                              editCertificate(cert);
                              setView("add");

                            }

                            else if (action === "delete") {

                              deleteCertificate(
                                cert.certificateId
                              );

                            }

                          }}
                        >

                          <option>
                            Actions
                          </option>

                          <option value="view">
                            View
                          </option>

                          <option value="edit">
                            Edit
                          </option>

                          <option value="delete">
                            Delete
                          </option>

                        </select>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          )}

        </div>

      )}

      {view === "details" &&
        selectedCertificate && (

        <div>

          <button
            onClick={() => setView("view")}
          >
            ← Back
          </button>

          <h1>Certificate Details</h1>

          <div className="details-card">

            <p>
              <strong>Certificate Name:</strong>
              {" "}
              {selectedCertificate.certificateName}
            </p>

            <p>
              <strong>Issued To:</strong>
              {" "}
              {selectedCertificate.issuedTo}
            </p>

            <p>
              <strong>Authority:</strong>
              {" "}
              {selectedCertificate.authority}
            </p>

            <p>
              <strong>Issue Date:</strong>
              {" "}
              {selectedCertificate.issueDate}
            </p>

            <p>
              <strong>Expiry Date:</strong>
              {" "}
              {selectedCertificate.expiryDate}
            </p>

          </div>

        </div>

      )}

    </div>

  );

}

export default App;