import { useState, useEffect } from "react";
import { supabase } from "../../api/supabase";
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, SimpleGrid, Heading, Alert, AlertIcon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SalesForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_id: "",
    branch_id: "",
    date: "",
    frame: "",
    lens: "",
    delivery_time: "",
    p_frame: 0,
    p_lens: 0,
    total: 0,
    credit: 0,
    balance: 0,
    payment_in: "",
    message: "",
  });

  const [branches, setBranches] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null); 


  useEffect(() => {
    fetchData('branch', setBranches);
    fetchData('patients', (data) =>  {
      setPatients(data);
      setFilteredPatients(data);
    });
  }, []);

  const fetchData = async (table, setter) => {
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      setter(data);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(`Error al obtener los datos de ${table}`);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = (e) => {
    const terms = e.target.value.toLowerCase().split(" ");
    setSearchTerm(e.target.value);
  
    setFilteredPatients(
      patients.filter((patient) => {
        const fullName = `${patient.pt_firstname} ${patient.pt_lastname}`.toLowerCase();
        return terms.every((term) => 
          fullName.includes(term) || patient.pt_ci?.toLowerCase().includes(term)
        );
      })
    );
  };
  
  
  

  const handlePatientSelect = (patient) => {
    const fullName = `${patient.pt_firstname} ${patient.pt_lastname}`;
    setFormData({ ...formData, patient_id: patient.id })
    setSearchTerm(fullName);
    setFilteredPatients([]);
  };

  const handleSubmit = async () => {
    if (!formData.patient_id || !formData.branch_id || !formData.date) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      const { data, error } = await supabase.from("sales").insert([formData]);
      if (error) throw error;
      console.log("Venta registrada:", data);
      alert("Venta registrada exitosamente.");
    } catch (error) {
      console.error("Error al registrar venta:", error.message);
      alert("Hubo un error al registrar la venta.");
    }
  };

  const handleReset = () => {
    setFormData({
      patient_id: "",
      branch_id: "",
      date: "",
      frame: "",
      lens: "",
      delivery_time: "",
      p_frame: 0,
      p_lens: 0,
      total: 0,
      credit: 0,
      balance: 0,
      payment_in: "",
      message: "",
    });
  };

  const handleNavigate = (route) => navigate(route);

  return (
    <Box className="sales-form" display="flex" flexDirection="column" alignItems="center" minHeight="100vh">

      <Heading mb={4}>Registrar Venta</Heading>
  
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Box
      key={patients.id}
      padding={2}
      _hover={{ bg: "teal.100", cursor: "pointer" }}
      onClick={() => handlePatientSelect(patients)}
      >
    <strong>{patients.pt_firstname}</strong> {patients.pt_lastname} - {patients.pt_ci}
    </Box>

  
      <Box display="flex" justifyContent="space-between" width="100%" maxWidth="800px" mb={4}>
        <Button onClick={() => handleNavigate("/ConsultarCierre")} colorScheme="teal">
          Consultas de Cierre
        </Button>
        <Button onClick={() => handleNavigate("/Admin")} colorScheme="blue">
          Volver a Opciones
        </Button>
        <Button onClick={() => handleNavigate("/LoginForm")} colorScheme="red">
          Cerrar Sesión
        </Button>
      </Box>
      
  
      <Box
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        width="100%"
        maxWidth="800px"
        padding={6}
        boxShadow="lg"
        borderRadius="md"
      >
        <SimpleGrid columns={[1, 2]} spacing={4}>
          <FormControl id="patient-search">
            <FormLabel>Buscar Paciente</FormLabel>
            <Input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <Box border="1px solid #ccc" borderRadius="md" mt={2} maxHeight="150px" overflowY="auto">
                {filteredPatients.map((patient) => (
                  <Box
                    key={patient.id}
                    padding={2}
                    _hover={{ bg: "teal.100", cursor: "pointer" }}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    {patient.pt_firstname || patient.full_name}
                  </Box>
                ))}
              </Box>
            )}
          </FormControl>
  
          <FormControl id="branch_id" isRequired>
            <FormLabel>Sucursal</FormLabel>
            <Select
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
            >
              <option value="">Seleccione una sucursal</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name_branch || branch.id}
                </option>
              ))}
            </Select>
          </FormControl>
  
          {renderInputField("Fecha", "date", "date", true)}
          {renderInputField("Armazón", "frame", "text")}
          {renderInputField("Lunas", "lens", "text")}
          {renderSelectField("Tiempo de Entrega", "delivery_time", [
            { id: "1 día", name_branch: "1 día" },
            { id: "2 días", name_branch: "2 días" },
          ])}
          {renderInputField("P. Armazón", "p_frame", "number")}
          {renderInputField("P. Lunas", "p_lens", "number")}
          {renderInputField("Total", "total", "number")}
          {renderInputField("Abono", "credit", "number")}
          {renderInputField("Saldo", "balance", "number")}
          {renderSelectField("Pago en", "payment_in", [
            { id: "efectivo", name: "Efectivo" },
            { id: "datafast", name: "Datafast" },
          ])}
          {renderTextareaField("Mensaje", "message")}
        </SimpleGrid>
  
        <Box display="flex" justifyContent="space-around" mt={6}>
          <Button type="submit" colorScheme="teal">
            Guardar
          </Button>
          <Button onClick={handleReset} colorScheme="gray">
            Limpiar
          </Button>
        </Box>
      </Box>
    </Box>
  );
  

  function renderInputField(label, name, type, isRequired = false) {
    return (
      <FormControl id={name} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Input type={type} name={name} value={formData[name]} onChange={handleChange} />
      </FormControl>
    );
  }

  function renderTextareaField(label, name) {
    return (
      <FormControl id={name}>
        <FormLabel>{label}</FormLabel>
        <Textarea name={name} value={formData[name]} onChange={handleChange} />
      </FormControl>
    );
  }

  function renderSelectField(label, name, options, isRequired = false) {
    return (
      <FormControl id={name} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Select name={name} value={formData[name]} onChange={handleChange}>
          <option value="">Seleccione {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name_branch || option.id}
            </option>
          ))}
        </Select>
      </FormControl>
    );
  }
};

export default SalesForm;
