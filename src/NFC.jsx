import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NFCComponent = () => {
    const [message, setMessage] = useState('');
    const [nfcUrl, setNfcUrl] = useState('https://mo-ismail.web.app/');
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState('');

    const writeToNFC = async () => {
        setScanning(true);
        try {
            if ('NDEFReader' in window) {
                const ndef = new window.NDEFReader();
                await ndef.write({
                    records: [{ recordType: 'url', data: nfcUrl }],
                });
                setMessage("NFC Card opened the URL successfully...");
            } else {
                setError("NFC writing is not supported on this device/browser.");
            }
        } catch (error) {
            console.error('Error writing to NFC tag:', error);
            alert('Cannot write to NFC tag: ' + error.message);
        }
        setScanning(false);
    };

    const readFromNFC = async () => {
        setScanning(true);
        try {
            if ('NDEFReader' in window) {
                const ndef = new window.NDEFReader();
                await ndef.scan();

                ndef.onreading = (event) => {
                    const message = event.message;
                    for (const record of message.records) {
                        if (record.recordType === 'url') {
                            const url = new TextDecoder().decode(record.data);
                            setMessage(`NFC Tag contains URL: ${url}`);
                            window.location.href = url;
                        } else {
                            setMessage('NFC Tag read, but no URL found.');
                        }
                    }
                };

                // Automatically stop scanning after 1 minute (60000 ms)
                setTimeout(() => {
                    ndef.onreading = null;
                    setScanning(false);
                    setError('NFC scan timed out. Please try again.');
                }, 60000); // 60 seconds

            } else {
                setError("NFC reading is not supported on this device/browser.");
            }
        } catch (error) {
            console.error('Error reading from NFC tag:', error);
            alert('Cannot read NFC tag: ' + error.message);
        }
    };

    return (
        <div className="container text-center mt-5">
            <h1>NFC Demo2</h1>
            {
                scanning === false ? (
                    <div 
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            gap: '.5rem'
                        }}
                    >
                        <button 
                            className="btn btn-primary mt-3 " 
                            onClick={writeToNFC}
                        >
                            Write to NFC Card
                        </button>
                        <button 
                            className="btn btn-secondary mt-3 " 
                            onClick={readFromNFC}
                        >
                            Scan NFC Card
                        </button>
                    </div>
                ) : (
                    <>
                        <h1>PLZ Near NFC Card From mobile to scan</h1>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </>
                )
            }
            {message && <p className="mt-3 text-success">{message}</p>}
            {error && <p className="mt-3 text-danger">{error}</p>}
        </div>
    );
};

export default NFCComponent;
