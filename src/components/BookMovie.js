import React, { useEffect, useState } from 'react'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BookMovie(props) {

    // variables for seats :-
    const [seatA1, setSeatA1] = useState(0)
    const [seatA2, setSeatA2] = useState(0)
    const [seatA3, setSeatA3] = useState(0)
    const [seatA4, setSeatA4] = useState(0)
    const [seatD1, setSeatD1] = useState(0)
    const [seatD2, setSeatD2] = useState(0)


    // creating a variable which will be true if there's atleast one document in the database else false :-
    const [showLastBooking, setShowLastBooking] = useState(false)

    // creating three array which contains objects in which every object contains movie name, time slots, seats and a boolean which initially have value false (it is generally created to add a specific class in classlist of that div whenever someone clicks) :-
    const [movieArr, setMovieArr] = useState([
        { name: "Suraj Par Mangal Bhari", status: false },
        { name: "Tenet", status: false },
        { name: "The War With Grandpa", status: false },
        { name: "The Personal History Of Dravid Copperfield", status: false },
        { name: "Come Play", status: false }
    ])

    const [timeArr, setTimeArr] = useState([
        { time: "10:00 AM", status: false },
        { time: "01:00 PM", status: false },
        { time: "03:00 PM", status: false },
        { time: "08:00 PM", status: false }
    ])

    const [seatArr, setSeatArr] = useState([
        { seat: "Type A1", status: false },
        { seat: "Type A2", status: false },
        { seat: "Type A3", status: false },
        { seat: "Type A4", status: false },
        { seat: "Type D1", status: false },
        { seat: "Type D2", status: false }
    ])

    // creating an object which contains an overall information of movie name, time slot and no. and type of seat selected :-
    const [summaryBooking, setSummaryBooking] = useState({
        A1: 0,
        A2: 0,
        A3: 0,
        A4: 0,
        D1: 0,
        D2: 0,
        movieName: "",
        timing: ""
    })

    const [toggle, setToggle] = useState(0)

    // Here are some functions are define ( handleMovieClick, handleSlotClick, handleSeatClick ) which comes into play whenever someone clicks on movie icons, slot icon and seat inputs, basically giving information that what are been selected :-
    const handleMovieClick = (index) => {
        const newMovieArr = movieArr.map((elem, ind) => {
            return ind === index ? { ...elem, status: elem.status === false ? true : false } : { ...elem, status: false }
        })
        setMovieArr(newMovieArr)

        if (newMovieArr[index].status === true) {
            setSummaryBooking({ ...summaryBooking, movieName: movieArr[index].name })
        } else {
            setSummaryBooking({ ...summaryBooking, movieName: "" })
        }

    }

    const handleSlotClick = (index) => {
        const newTimeArr = timeArr.map((elem, ind) => {
            return ind === index ? { ...elem, status: elem.status === false ? true : false } : { ...elem, status: false }
        })
        setTimeArr(newTimeArr)

        if (newTimeArr[index].status === true) {
            setSummaryBooking({ ...summaryBooking, timing: timeArr[index].time })
        } else {
            setSummaryBooking({ ...summaryBooking, timing: "" })
        }

    }

    const handleSeatClick = (index) => {
        const newSeatArr = seatArr.map((elem, ind) => {
            return ind === index ? { ...elem, status: true } : { ...elem, status: false }
        })
        setSeatArr(newSeatArr)
    }

    // Defining a function (resetData) which get called whenever clicks on submit button :-
    const resetData = () => {

        setMovieArr([
            { name: "Suraj Par Mangal Bhari", status: false },
            { name: "Tenet", status: false },
            { name: "The War With Grandpa", status: false },
            { name: "The Personal History Of Dravid Copperfield", status: false },
            { name: "Come Play", status: false }
        ])

        setTimeArr([
            { time: "10:00 AM", status: false },
            { time: "01:00 PM", status: false },
            { time: "03:00 PM", status: false },
            { time: "08:00 PM", status: false }
        ])

        setSeatArr([
            { seat: "Type A1", status: false },
            { seat: "Type A2", status: false },
            { seat: "Type A3", status: false },
            { seat: "Type A4", status: false },
            { seat: "Type D1", status: false },
            { seat: "Type D2", status: false }
        ])

        setSeatA1(0); setSeatA2(0); setSeatA3(0); setSeatA4(0); setSeatD1(0); setSeatD2(0)

        setSummaryBooking(summaryBooking => ({
            ...summaryBooking,
            movieName: "",
            timing: ""
        })
        )

    }
    

    // Defining a function which is called when submit button is clicked, basically it is sending data to server and by there it get saved in database :-
    const handleBookClick = async () => {

        try {

            if (summaryBooking.movieName !== "" &&
                summaryBooking.timing !== "" &&
                (summaryBooking.A1 !== 0 || summaryBooking.A2 !== 0 || summaryBooking.A3 !== 0 || summaryBooking.A4 !== 0 || summaryBooking.D1 !== 0 || summaryBooking.D2 !== 0)
            ) {

                await axios.post(`${props.serverUrl}/api/booking`, summaryBooking)
                setToggle(toggle === 0 ? 1 : 0)
                toast.success(`Booked movie: ${summaryBooking.movieName}`)
                resetData()

            } else {
                toast.error("Please fill properly 😒")
            }

        } catch (err) {

            toast.error("Some error happened ☹️")

        }
    };

    const [lastBookingHistory, setLastBookingHistory] = useState([])

    // Defining a function which get last booking data from the server :-
    const lastBookedMovie = async () => {

        try {

            const result = await axios.get(`${props.serverUrl}/api/booking`)
            if (result.data.length !== 0) {
                setShowLastBooking(true)
            }
            setLastBookingHistory(result.data)

        } catch (err) {

            toast.error("Can't fetch data 😣")

        }

    }

    useEffect(() => {
        setSummaryBooking(summaryBooking => ({
            ...summaryBooking,
            A1: seatA1,
            A2: seatA2,
            A3: seatA3,
            A4: seatA4,
            D1: seatD1,
            D2: seatD2,
        }));
    }, [seatA1, seatA2, seatA3, seatA4, seatD1, seatD2]);

    useEffect(() => {

        lastBookedMovie()

    }, [])

    useEffect(() => {

        lastBookedMovie()

    }, [toggle])

    const formatDateToDdMmYy = (date) => {
        let newDate = date.slice(0, 10)
        return newDate
    }


    return (
        <div className='booking-container'>
            <div className="present-booking">
                <h1 style={{ marginBottom: "20px" }}>Book Your Show !! </h1>
                <div className='movie-row'>
                    <h3>Select A Movie</h3>
                    {
                        movieArr.map((elem, index) => {
                            return <div onClick={() => handleMovieClick(index)} key={index} className={elem.status ? "movie-column movie-column-selected" : "movie-column"}>
                                {elem.name}
                            </div>
                        })
                    }
                </div>
                <div className='slot-row'>
                    <h3>Select a Time Slot</h3>
                    {
                        timeArr.map((elem, index) => {
                            return <div onClick={() => handleSlotClick(index)} key={index} className={elem.status ? "slot-column slot-column-selected" : "slot-column"}>
                                {elem.time}
                            </div>
                        })
                    }
                </div>
                <div className="seat-row">
                    <h3>Select the Seats</h3>
                    <div onClick={() => handleSeatClick(0)} className={seatArr[0].status ? "seat-column seat-column-selected" : "seat-column"}>
                        <div>{seatArr[0].seat}</div>
                        <input onChange={(e) => setSeatA1(e.target.value)} className='input-margin' type="number" value={seatA1} />
                    </div>
                    <div onClick={() => handleSeatClick(1)} className={seatArr[1].status ? "seat-column seat-column-selected" : "seat-column"}>
                        <div>{seatArr[1].seat}</div>
                        <input onChange={(e) => setSeatA2(e.target.value)} className='input-margin' type="number" value={seatA2} />
                    </div>
                    <div onClick={() => handleSeatClick(2)} className={seatArr[2].status ? "seat-column seat-column-selected" : "seat-column"}>
                        <div>{seatArr[2].seat}</div>
                        <input onChange={(e) => setSeatA3(e.target.value)} className='input-margin' type="number" value={seatA3} />
                    </div>
                    <div onClick={() => handleSeatClick(3)} className={seatArr[3].status ? "seat-column seat-column-selected" : "seat-column"}>
                        <div>{seatArr[3].seat}</div>
                        <input onChange={(e) => setSeatA4(e.target.value)} className='input-margin' type="number" value={seatA4} />
                    </div>
                    <div onClick={() => handleSeatClick(4)} className={seatArr[4].status ? "seat-column seat-column-selected" : "seat-column"}>
                        <div>{seatArr[4].seat}</div>
                        <input onChange={(e) => setSeatD1(e.target.value)} className='input-margin' type="number" value={seatD1} />
                    </div>
                    <div onClick={() => handleSeatClick(5)} className={seatArr[5].status ? "seat-column seat-column-selected" : "seat-column"}>
                        <div>{seatArr[5].seat}</div>
                        <input onChange={(e) => setSeatD2(e.target.value)} className='input-margin' type="number" value={seatD2} />
                    </div>
                </div>
                <div className="book-button">
                    <button type='submit' onClick={handleBookClick}>Book Movie</button>
                </div>
            </div>
            <div>
                {
                    showLastBooking ? (
                        <div className="previous-record">

                            <h3>Last Booking Status : </h3>
                            {
                                lastBookingHistory.map((elem, index) => {
                                    return <div className='inside-previous-record'>
                                        <div>
                                            <div style={{ fontWeight: "bold" }}>Seat : </div>
                                            <p>A1: {elem.A1}</p>
                                            <p>A2: {elem.A2}</p>
                                            <p>A3: {elem.A3}</p>
                                            <p>A4: {elem.A4}</p>
                                            <p>D1: {elem.D1}</p>
                                            <p>D2: {elem.D2}</p>
                                        </div>
                                        <div style={{ marginBottom: "1vw" }}> <span style={{ fontWeight: "bold" }}>MovieName:</span> {elem.movieName}</div>
                                        <div style={{ marginBottom: "1vw" }}> <span style={{ fontWeight: "bold" }}>Timing:</span> {elem.timing}</div>
                                        <div style={{ marginBottom: "1vw" }}> <span style={{ fontWeight: "bold" }}>Date:</span> {
                                            formatDateToDdMmYy(elem.date)
                                        }</div>

                                    </div>
                                })
                            }
                        </div>



                    ) : (<h3>No Record Found</h3>)
                }
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
