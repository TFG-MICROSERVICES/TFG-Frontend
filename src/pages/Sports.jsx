import { useState, useEffect, useContext } from "react";
import { useSearch } from "../hooks/useSearch";
import { SearchBar } from "../components/ui/SearchBar";
import { useDebounce } from "../hooks/useDebounce";
import { getSports } from "../api/request/get/sports/getSports";
import { toast } from "react-toastify";
import { CardSport } from "../components/ui/CardSport";
import { Button } from "../components/ui/Button";
import { LoginContext } from "../context/LoginContext";
import { Modal } from "../components/ui/Modal";
import { FormProvider } from "../context/FormProvider";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

const currentSport = {};

const status = [
  {
    value: "0",
    label: "Inactiva",
  },
  {
    value: "1",
    label: "Activa",
  },
];

export const Sports = () => {
  const [sports, setSports] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const { search, handleSearch } = useSearch("");
  const debounceSearch = useDebounce(search, 300);
  const { login } = useContext(LoginContext);

  console.log(search);

  const fetchSports = async () => {
    try {
      const response = await getSports(search);
      if (response.status !== 200) toast.error("Error al buscar el equipo");
      setSports[response.sports.sports];
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnEdit = () => {
    console.log("edit");
  };

  const handleOpenModal = () => {
    console.log("Abriendo modal");
    setOpenModal(true);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setOpenModal(false);
  };

  useEffect(() => {
    console.log(search);
    fetchSports();
  }, [debounceSearch]);

  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal} title={"Prueba"}>
        <FormProvider initialValue={currentSport} clase="w-full items-center">
          <div className="grid grid-cols-2 w-full justify-center items-center gap-4">
            <div className="w-full flex flex-col gap-4">
              <Input
                label="Nombre"
                name="name"
                type="text"
                required
                placeholder="Introduzca el nombre del deporte"
                clase="w-1/2"
              />

              <Input
                label="Cantidad mínima de jugadores"
                name="minimun_players"
                type="number"
                required
                placeholder="Introduzca la cantidad minima de jugadores por equipo"
                clase="w-1/2"
              />
            </div>

            <div className="w-full flex flex-col gap-4">
              <Input
                label="Descripción"
                name="description"
                type="text"
                placeholder="Introduzca la descripción del deporte"
                clase="w-full"
              />

              <Input
                label="Imagen"
                name="image"
                type="image"
                placeholder="Introduzca la foto del deporte"
                clase="w-full"
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center mt-5 h-full">
            <Select
              placeholder="Selecciona el estado del deporte"
              options={status}
              handleSelectOption={(value) => setCurrentStatus(value)}
              label="Estado"
              required
              clase="w-full"
              name="status"
            />

            <div className="flex flex-row gap-4 w-full mt-10 items-end justify-end">
              <Button onClick={handleCloseModal} clase="w-full" text="Cerrar" />

              <Button type="submit" clase="w-full" text="Registrar deporte" />
            </div>
          </div>
        </FormProvider>
      </Modal>
      <div>
        <div className="w-full flex flex-row gap-2">
          <SearchBar
            setSearch={handleSearch}
            text="Buscar deporte..."
            clase="max-w-[87%]"
          />
          {login?.admin && (
            <Button
              handleOnClick={handleOpenModal}
              text={window.innerWidth <= 768 ? "+" : "Crear nuevo deporte"}
              clase="w-1/4 md:w-full"
            />
          )}
        </div>
        {sports.map((sport) => (
          <CardSport key={sport.id} user={sport} handleOnEdit={handleOnEdit} />
        ))}
      </div>
    </>
  );
};
