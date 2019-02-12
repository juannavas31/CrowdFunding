
SOURCE_DIR = ./contracts
OUTPUT_DIR = ./bin
FLAGS = --bin --abi --ast --asm --overwrite

#dependendy rule
$(OUTPUT_DIR)/%.bin: $(SOURCE_DIR)/%.sol
	# solc -o $(OUTPUT_DIR) $(flags) $(SOURCE_DIR)/$^
	# esa seria una sentencia generica para todos los ficheros en SOURCE_DIR

$(OUTPUT_DIR)/CrowdFunding.bin: $(SOURCE_DIR)/CrowdFunding.sol
	solc -o $(OUTPUT_DIR) $(FLAGS) $(SOURCE_DIR)/CrowdFunding.sol
