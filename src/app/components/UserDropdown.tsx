import { useState, useEffect } from "react";
import { firstValueFrom } from "rxjs";
import { BackendService, User } from "../../backend";

interface UserListProps {
  backend: BackendService;
  completed: boolean;
  ticketId: number;
  settingNewUser: boolean;
  setSettingNewUser: any;
}

export const UserDropdown = ({
  backend,
  completed,
  ticketId,
  settingNewUser,
  setSettingNewUser,
}: UserListProps) => {
  const [users, setUsers] = useState([] as User[]);
  const [newUser, setNewUser] = useState(NaN);
  const [error, setError] = useState("");

  //when component loads - fetch users
  useEffect(() => {
    const fetchData = async () => {
      const result = await firstValueFrom(backend.users());
      setUsers(result);
    };
    fetchData();
  }, [backend]);

  //display users on dropdown to select who to assign ticket to
  const renderUsers = () => {
    if (users.length) {
      return users.map((user: User) => {
        return (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        );
      });
    } else {
      return <option value="">Loading...</option>;
    }
  };

  //assign ticket to user in backend
  const assignUser = (ticketId: number, newUser: number) => {
    if (isNaN(newUser)) {
      setError("You must select a user");
    } else {
      setError("");
      setSettingNewUser(true);
      const assignTicketToUser = backend.assign(ticketId, newUser);
      assignTicketToUser.subscribe((_) => {
        setSettingNewUser(false);
      });
      return assignTicketToUser;
    }
  };

  return (
    <div>
      <label>Assign to User: </label>{" "}
      <select
        disabled={completed}
        onChange={(e: any) => setNewUser(e.target.value)}
      >
        <option value="">Please select</option>
        {renderUsers()}
      </select>{" "}
      <button
        onClick={() => assignUser(ticketId, newUser)}
        disabled={completed || settingNewUser}
      >
        Assign
      </button>{" "}
      {/* display when user is being assigned */}
      {settingNewUser ? <span>...Assigning to user...</span> : ""}
      {error}
    </div>
  );
};
