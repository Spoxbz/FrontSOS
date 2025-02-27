import { Box, Button, FormControl, FormLabel, Input, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../api/supabase.js";

const Branch = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        cell: '',
        ruc: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleNavigate = (route) => {
        navigate(route);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('branchs')
            .insert([formData]);

        if (error) {
            console.error('Error:', error);
        } else {
            console.log('User registered:', data);
        }
    };

    return (
        <Box
            className="signup-form"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgColor="#f4f4f4"
        >
            <Box width="100%" maxWidth="800px" bgColor="white" p={6} borderRadius="lg" boxShadow="lg">
                <Heading as="h3" size="lg" textAlign="center" mb={6} color="black">
                    Sucursal
                </Heading>

                <Box display="flex" justifyContent="space-between" mb={6}>
                    <Button
                        onClick={() => handleNavigate('/ListBranch')}
                        bgColor="#00A8C8"
                        color="white"
                        _hover={{ bgColor: "#008B94" }}
                    >
                        Listar Inventario
                    </Button>
                    <Button
                        onClick={() => handleNavigate('/Admin')}
                        bgColor="#00A8C8"
                        color="white"
                        _hover={{ bgColor: "#008B94" }}
                    >
                        Volver a Opciones
                    </Button>
                    <Button
                        onClick={() => handleNavigate('/LoginForm')}
                        bgColor="#e44c65"
                        color="white"
                        _hover={{ bgColor: "#cc3c53" }}
                    >
                        Cerrar Sesión
                    </Button>
                </Box>

                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
                    <FormControl id="name" isRequired>
                        <FormLabel color="black">Nombre</FormLabel>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            bgColor="#f0f0f0"
                            borderColor="#00A8C8"
                            _focus={{ borderColor: "#008B94" }}
                        />
                    </FormControl>
                    <FormControl id="address" isRequired>
                        <FormLabel color="black">Dirección</FormLabel>
                        <Input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            bgColor="#f0f0f0"
                            borderColor="#00A8C8"
                            _focus={{ borderColor: "#008B94" }}
                        />
                    </FormControl>
                    <FormControl id="email" isRequired>
                        <FormLabel color="black">Correo</FormLabel>
                        <Input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            bgColor="#f0f0f0"
                            borderColor="#00A8C8"
                            _focus={{ borderColor: "#008B94" }}
                        />
                    </FormControl>
                    <FormControl id="cell" >
                        <FormLabel color="black">Teléfono</FormLabel>
                        <Input
                            type="text"
                            name="cell"
                            value={formData.cell}
                            onChange={handleChange}
                            bgColor="#f0f0f0"
                            borderColor="#00A8C8"
                            _focus={{ borderColor: "#008B94" }}
                        />
                    </FormControl>
                    <FormControl id="ruc">
                        <FormLabel color="black">RUC</FormLabel>
                        <Input
                            type="text"
                            name="ruc"
                            value={formData.ruc}
                            onChange={handleChange}
                            bgColor="#f0f0f0"
                            borderColor="#00A8C8"
                            _focus={{ borderColor: "#008B94" }}
                        />
                    </FormControl>
                </Box>

                <Button
                    type="submit"
                    mt={4}
                    width="100%"
                    bgColor="#00A8C8"
                    color="white"
                    _hover={{ bgColor: "#008B94" }}
                    onClick={handleSubmit}
                >
                    Registrar
                </Button>
            </Box>
        </Box>
    );
};

export default Branch;
