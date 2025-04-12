import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  FormErrorMessage,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  useColorMode,
  Text,
  Flex,
  Badge,
  Box,
  Divider,
  Icon,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { WishlistItem, Category } from '../../types/models';
import { FaBitcoin, FaTrash } from 'react-icons/fa';
import { mockCategories } from './MockData';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: WishlistItem; // Existing item if editing, undefined if adding new
  onSave: (item: Partial<WishlistItem>) => void;
  onDelete?: (itemId: string) => void;
}

// Default form values
const defaultFormValues = {
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  priority: 'medium',
  url: '',
  imageUrl: '',
  notes: ''
};

export const ItemFormModal = ({ isOpen, onClose, item, onSave, onDelete }: ItemFormModalProps) => {
  const { colorMode } = useColorMode();
  const [formValues, setFormValues] = useState<Partial<WishlistItem>>(defaultFormValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [satsPreview, setSatsPreview] = useState<number | null>(null);
  
  const isEditMode = !!item;

  // Load item data when editing
  useEffect(() => {
    if (item) {
      setFormValues({
        ...item
      });
      setSatsPreview(item.satsEquivalent || null);
    } else {
      setFormValues(defaultFormValues);
      setSatsPreview(null);
    }
  }, [item, isOpen]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormValues((prev) => ({
      ...prev,
      [name]: numValue
    }));

    // Clear error for this field if exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formValues.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formValues.price === undefined || formValues.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formValues.priority) {
      newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formValues);
      onClose();
    }
  };

  // Simulate calculating satoshi preview
  // In a real app, this would use the BitcoinService.usdToSats
  useEffect(() => {
    if (formValues.price && formValues.price > 0 && formValues.currency === 'USD') {
      // Mock conversion rate: 1 USD = ~1,600 sats at 60k BTC/USD
      const mockConversion = formValues.price * 1600;
      setSatsPreview(Math.round(mockConversion));
    } else {
      setSatsPreview(null);
    }
  }, [formValues.price, formValues.currency]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <ModalHeader>{isEditMode ? 'Edit Wishlist Item' : 'Add New Wishlist Item'}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Item Name</FormLabel>
              <Input 
                name="name" 
                value={formValues.name || ''} 
                onChange={handleChange} 
                placeholder="What do you want to buy?"
              />
              {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea 
                name="description" 
                value={formValues.description || ''} 
                onChange={handleChange} 
                placeholder="Brief description of the item"
                resize="vertical"
                rows={2}
              />
            </FormControl>

            <HStack spacing={4} align="flex-start">
              <FormControl isRequired isInvalid={!!errors.price} flex="2">
                <FormLabel>Price</FormLabel>
                <NumberInput min={0} precision={2} value={formValues.price || ''}>
                  <NumberInputField 
                    name="price" 
                    onChange={(e) => handleNumberChange('price', e.target.value)} 
                    placeholder="0.00"
                  />
                </NumberInput>
                {errors.price && <FormErrorMessage>{errors.price}</FormErrorMessage>}
              </FormControl>

              <FormControl flex="1">
                <FormLabel>Currency</FormLabel>
                <Select name="currency" value={formValues.currency || 'USD'} onChange={handleChange}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="JPY">JPY</option>
                </Select>
              </FormControl>
            </HStack>

            {/* Bitcoin conversion preview */}
            {satsPreview && (
              <Box 
                p={3} 
                bg={colorMode === 'light' ? 'yellow.50' : 'yellow.900'} 
                borderRadius="md"
              >
                <Flex align="center">
                  <Icon as={FaBitcoin} color="orange.500" boxSize="1.2em" mr={2} />
                  <Text fontWeight="medium">
                    Approximately <Text as="span" fontWeight="bold">{satsPreview.toLocaleString()}</Text> sats
                  </Text>
                </Flex>
              </Box>
            )}

            <HStack spacing={4} align="flex-start">
              <FormControl isRequired isInvalid={!!errors.priority} flex="1">
                <FormLabel>Priority</FormLabel>
                <Select name="priority" value={formValues.priority || 'medium'} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
                {errors.priority && <FormErrorMessage>{errors.priority}</FormErrorMessage>}
              </FormControl>

              <FormControl flex="1">
                <FormLabel>Category</FormLabel>
                <Select 
                  name="category" 
                  value={formValues.category || ''} 
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {mockCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            <Divider />

            <FormControl>
              <FormLabel>Product URL</FormLabel>
              <Input 
                name="url" 
                value={formValues.url || ''} 
                onChange={handleChange} 
                placeholder="https://..."
                type="url"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input 
                name="imageUrl" 
                value={formValues.imageUrl || ''} 
                onChange={handleChange} 
                placeholder="https://..."
                type="url"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea 
                name="notes" 
                value={formValues.notes || ''} 
                onChange={handleChange} 
                placeholder="Additional notes about this item..."
                resize="vertical"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          {isEditMode && onDelete && (
            <Tooltip label="Delete this item" placement="top">
              <IconButton
                aria-label="Delete item"
                icon={<FaTrash />}
                colorScheme="red"
                variant="ghost"
                mr="auto"
                onClick={() => {
                  if (item && window.confirm('Are you sure you want to delete this item?')) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
              />
            </Tooltip>
          )}
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="yellow" onClick={handleSubmit}>
            {isEditMode ? 'Save Changes' : 'Add Item'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};