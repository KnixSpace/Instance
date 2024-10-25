import { useEffect, useState, useRef } from "react";
import { X, Maximize2, PencilLine, ChevronDown } from "lucide-react";

interface FormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
}

const FormPopup: React.FC<FormPopupProps> = ({ isOpen, onClose, nodeData }) => {
  if (!isOpen) return null;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  interface EventType {
    name: string;
    description: string;
  }

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [account, setAccount] = useState("Gmail flowmakerapp@gmail.com");
  const [appName, setAppName] = useState("Gmail");

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  const toggleEventDropdown = () =>
    setIsEventDropdownOpen(!isEventDropdownOpen);

  const triggerEvents = [
    {
      name: "New Attachment",
      description: "Triggers when you receive a new attachment.",
    },
    {
      name: "New Email",
      description:
        "Triggers when a new email appears in the specified mailbox.",
    },
    {
      name: "New Email Matching Search",
      description:
        "Triggers when you receive a new email that matches a search string you provide.",
    },
    { name: "New Label", description: "Triggers when you add a new label." },
    {
      name: "New Labeled Email",
      description: "Triggers when a new email is labeled.",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsEventDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsEventDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEventSelect = (event: EventType) => {
    setSelectedEvent(event);
    setIsEventDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      console.log("Form submitted with:", {
        appName,
        selectedEvent: selectedEvent.name,
        account,
      });
    }
  };

  return (
    <div>
        {/* <pre>{JSON.stringify(nodeData, null, 2)}</pre> */}
      <button onClick={openForm}>Open Form</button>

      {isFormOpen && (
        <div className="form-container">
          <div className="form-header">
            <div className="header-left">
              <img src="/mail.png" alt="Gmail logo" className="gmail-logo" />
              <h2>1. Select the event</h2>
              <PencilLine size={16} className="edit-icon" />
            </div>
            <div className="header-right">
              <Maximize2 size={16} className="maximize-icon" />
              <X size={16} className="close-icon" onClick={closeForm} />
            </div>
          </div>
          <div className="form-tabs">
            <button className="tab active">Setup</button>
            <button className="tab">Test</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>App *</label>
              <div className="input-group">
                <input type="text" value={appName} readOnly />
                <button type="button" className="change-btn">
                  Change
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Trigger event *</label>
              <div
                className="select-wrapper"
                onClick={toggleEventDropdown}
                ref={dropdownRef}
              >
                <div className="select-display">
                  <span>
                    {selectedEvent ? selectedEvent.name : "Choose an event"}
                  </span>
                  <ChevronDown size={16} />
                </div>
                {isEventDropdownOpen && (
                  <div className="event-dropdown">
                    <input
                      type="text"
                      placeholder="Search events"
                      className="event-search"
                    />
                    {triggerEvents.map((event, index) => (
                      <div
                        key={index}
                        className="event-option"
                        onClick={() => handleEventSelect(event)}
                      >
                        <strong>{event.name}</strong>
                        <p>{event.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Account *</label>
              <div className="input-group">
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
                <button type="button" className="change-btn">
                  Change
                </button>
              </div>
            </div>

            <p className="info-text">
              Gmail is a secure partner with Instance.
              <a href="#">
                Your credentials are encrypted and can be removed at any time.
              </a>
              You can{" "}
              <a href="#">manage all of your connected accounts here.</a>
            </p>

            <button
              type="submit"
              className="submit-btn"
              disabled={!selectedEvent}
            >
              To continue, choose an event
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .form-container {
          position: fixed;
          top: 50%;
          right: 5%;
          transform: translateY(-50%);
          width: 400px;
          background-color: #fff;
          border: 2px solid #7441fe;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
          overflow: visible;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: #f4f4f7;
          border-bottom: 1px solid #7441fe;
          color: black;
        }

        .header-left,
        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gmail-logo {
          width: 30px;
          height: 30px;
        }

        h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .edit-icon,
        .maximize-icon,
        .close-icon {
          cursor: pointer;
          color: #666;
        }

        .form-tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
        }

        .tab {
          padding: 12px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        .tab.active {
          color: #7441fe;
          border-bottom: 2px solid #7441fe;
        }

        form {
          padding: 16px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }

        input,
        select {
          width: calc(100% - 110px);
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-right: 5px;
          background-color: #fff;
          color: #333;
        }

        .input-group {
          display: flex;
          align-items: center;
        }

        .change-btn {
          padding: 10px;
          background-color: transparent;
          border: none;
          color: #7441fe;
          cursor: pointer;
        }

        .info-text {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }

        .info-text a {
          color: #7441fe;
          text-decoration: none;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          background-color: #ddd;
          border: none;
          border-radius: 4px;
          cursor: not-allowed;
          color: #666;
          font-weight: bold;
        }
        .select-wrapper {
          position: relative;
          cursor: pointer;
        }

        .select-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          color: black;
        }

        .event-dropdown {
          position: absolute;
          top: -20px;
          right: 100%;
          width: 300px;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 20;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .event-search {
          width: 100%;
          padding: 10px;
          border: none;
          border-bottom: 1px solid #ccc;
        }

        .event-option {
          padding: 10px;
          border-bottom: 1px solid #eee;
          color: black;
        }

        .event-option:last-child {
          border-bottom: none;
        }

        .event-option strong {
          display: block;
          margin-bottom: 5px;
        }

        .event-option p {
          margin: 0;
          font-size: 12px;
          color: #666;
        }

        .sign-in-btn {
          padding: 10px;
          background-color: #7441fe;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .submit-btn {
          background-color: ${selectedEvent ? "#7441fe" : "#ddd"};
          color: ${selectedEvent ? "white" : "#666"};
          cursor: ${selectedEvent ? "pointer" : "not-allowed"};
        }
      `}</style>
    </div>
  );
};

export default FormPopup;
