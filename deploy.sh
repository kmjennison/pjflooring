
source ./.env

if [ "$1" = "dev" ]; then
  export STAGE=DEV
  export S3_BUCKET=$DEV_S3_BUCKET
fi
if [ "$1" = "prod" ]; then
  export STAGE=PRODUCTION
  export S3_BUCKET=$PROD_S3_BUCKET
fi
if [ "$1" = "" ]; then
  echo "Specify \"dev\" or \"prod\"."
  echo "Exiting."
  exit
fi 

echo "=========================================="
echo "Going to deploy to $STAGE at $S3_BUCKET."
echo "Is this OK? [y/n]"
echo "=========================================="
read response
if [ $response != "y" ]; then
  echo "Exiting."
  exit
fi

echo "Deploying..."

aws s3 cp dist/ s3://$S3_BUCKET --recursive

echo "Done!"
